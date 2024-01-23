import React, { useEffect, useState } from 'react';
import { RecordPost } from './RecordPost';
import { useLoaderData } from 'react-router-dom';
import algoliasearch from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, useHits, useSearchBox, Configure } from 'react-instantsearch';
import { v4 as uuidv4 } from 'uuid';
import searchInsights from 'search-insights';
import { FaDeleteLeft } from 'react-icons/fa6';



const generateUserToken = (): string => {
  return uuidv4();
};

const userToken = generateUserToken();

const searchClient = algoliasearch('2580UW5I69', 'b0f5d0cdaf312c18df4a45012c4251e4', {
  headers: {
    'X-Algolia-UserToken': userToken,
  },
});




const CategorySearch = ({ onCategorySelect }: { onCategorySelect: (category: string[] | string) => void }) => {
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [placeholderCategories, setPlaceholderCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [customHit, setCustomHit] = useState<string>('');

  const handleCustomHitClick = (hit: any) => {
    setSelectedCategories([hit, ...selectedCategories]);
    setCurrentSearch('');
    setCustomHit('');
  };
  const CustomHitComponent = (hit: any) => {
    // console.log('custom hit', hit);
    return (
      <div className='custom-hit' onClick={() => handleCustomHitClick(hit.hit)}>
        <p>{hit.hit}</p>
      </div>
    );
  };

  const getAllCategories = async (): Promise<void> => {
    try {
      const allCats = await axios.get('/post/categories');
      setAllCategories(allCats.data);
    } catch (error) {
      console.error('error fetching all categories', error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('working', event.target.value, event);
    setCurrentSearch(event.target.value);
  };
  const handleCategorySelection = (category: string) => {
    console.log('handlecategoryselection on click', category);
    const trimmedCategory = category.trim();
    const updatedCategories = [...selectedCategories, trimmedCategory];
    // console.log('updatedCategories', updatedCategories);
    if (updatedCategories.length <= 5) {
      setSelectedCategories(updatedCategories);
      onCategorySelect(updatedCategories);
    } else {
      alert('You can only add up to 5 categories!');
    }
    setCurrentSearch('');
    // setPlaceholderCategories(null);
  };
  // create custom button using <FaDeleteLeft /> from react-icons to delete selected categories
  const CustomDeleteButton = ({ category, onSelect }: { category?: string; onSelect: (category: string) => void }) => {
    return (
      <button onClick={() => onSelect(category)}>
        {category}
        <FaDeleteLeft />
      </button>
    );
  };
  const CategoryWithDeleteButton = ({ category, onSelect }: { category?: string; onSelect: (category: string) => void }) => {
    return category ? <CustomDeleteButton category={category} onSelect={onSelect} /> : null;
  };
  const handleHitClick = (hit: any) => {
    if (typeof hit === 'object' && hit.length > 0 && hit[0].category) {
      console.log('hit inside of handlehitclick', hit);
      const selectedCategory = hit[0].category;
      const trimmedCategory = selectedCategory.trim();
      
      // Check if the category is already selected
      if (selectedCategories.includes(trimmedCategory)) {
        // Remove the category from selectedCategories
        const updatedCategories = selectedCategories.filter(category => category !== trimmedCategory);
        setSelectedCategories(updatedCategories);
        onCategorySelect(updatedCategories);
      } else {
        // Add the category if not already selected
        handleCategorySelection(trimmedCategory);
        setPlaceholderCategories(trimmedCategory);
      }
  
      setCurrentSearch('');
    } else if (typeof hit === 'string') {
      // If hit is a string, assume it's the category itself
      const trimmedCategory = hit.trim();
      
      // Check if the category is already selected
      if (selectedCategories.includes(trimmedCategory)) {
        // Remove the category from selectedCategories
        const updatedCategories = selectedCategories.filter(category => category !== trimmedCategory);
        setSelectedCategories(updatedCategories);
        onCategorySelect(updatedCategories);
        setPlaceholderCategories(updatedCategories);
      } else {
        // Add the category if not already selected
        handleCategorySelection(trimmedCategory);
        setPlaceholderCategories(trimmedCategory);
      }
  
      setCurrentSearch('');
    } else {
      console.error('Invalid hit object:', hit);
    }
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCategorySelection(currentSearch);
  };
  const Hit = ({ hit, onSelect }: { hit: any; onSelect: (category: string[] | string) => void }) => {
    const { hits } = useHits();
    // console.log('hits', hit); //the individual hit obj
    console.log('hits array', hits);
    //  filter the hits based on the current search
    const filteredHits = hits.filter((individualHit: any) => {
      return individualHit.category.toLowerCase().includes(currentSearch.toLowerCase());
    });
    console.log('search + indiv hits', currentSearch, filteredHits);
    return (
      // TODO: issue, when you click on a hit, it just adds the input value to the selected categories instead of the hit value
      <article id='cat-hit' onClick={() => onSelect(filteredHits)}
        style={{ border: '1px solid black', padding: '10px', margin: '10px' }}
      >
        {filteredHits.map(filteredHit => (
          <div key={filteredHit.objectID}>
            <p>{filteredHit.category}</p>
          </div>
        ))}

        {/* {filteredHits[0]} */}
      </article>
    );
  };
  useEffect(() => {
    console.log('selectedCategories', selectedCategories);
    console.log('placeholderCategories', placeholderCategories);
  }, [selectedCategories, placeholderCategories]);
  
  return (
    <div>
      <InstantSearch
        searchClient={searchClient}
        indexName="category_index"
        initialUiState={{ searchBox: { query: currentSearch } }}
        
      >
        {/* <SearchBox onInput={handleSearchChange} placeholder={'' || selectedCategory} className='input-control'/> */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={currentSearch}
            onInput={handleSearchChange}
            // placeholder={<CategoryWithDeleteButton category={placeholderCategories} onSelect={handleCategorySelection} /> || 'Add up to 5 categories!'}
            // placeholder={placeholderCategories ? <CategoryWithDeleteButton category={placeholderCategories} onSelect={handleCategorySelection} /> : 'Add up to 5 categories!'}
            placeholder={placeholderCategories ? placeholderCategories : 'Add up to 5 categories!'}
            className='input-control text-white mb-2'
            id='category-search'
          />
        </form>
        {/* create an input that holds the selected categories */}
        {currentSearch && <Hits className="cat-hits" hitComponent={(props) => <Hit {...props} onSelect={handleHitClick} />} />}
        {/* <input type="text" value={selectedCategories} readOnly={true} className='input-control text-white' id='category-read-only' /> */}
        <Configure userToken={userToken} />
        {selectedCategories ? selectedCategories.map((category, index) => (
          <CategoryWithDeleteButton key={index} category={category} onSelect={handleHitClick} />
        )) : null}
      </InstantSearch>
    </div>
  );
};

interface Props {
  setPostCategories: any
  setPostTitle: any
}

const PostCard = ({ setPostCategories, setPostTitle }) => {
  const [postCreated, setPostCreated] = useState(false);
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const user = useLoaderData();

  const handleCategorySelect = (selectedCategory: string | string[]) => {
    const array = Array.isArray(selectedCategory) ? selectedCategory : [selectedCategory];
    setCategories(array);
    setPostCategories(array);
  };
  return (
    <div style={{ marginTop: '-0.6rem' }}>
      <div id="responsive-navbar-nav" className={postCreated ? 'show' : ''}>
        <div className="d-flex justify-content-center">
          <div>
            <h4 className="mx-auto text-white" style={{ marginBottom: '0.9rem', fontFamily: 'headerFont' }}>Title</h4>
            <input type="text"
              maxLength={22}
              placeholder="Name your track"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setPostTitle(e.target.value);
              }}
              className='input-control text-white mx-2'
            />
          </div>
          <div>
            <h4 className="mx-auto text-white" style={{ marginBottom: '0.9rem', fontFamily: 'headerFont' }}>Categories</h4>
            <CategorySearch onCategorySelect={handleCategorySelect} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
