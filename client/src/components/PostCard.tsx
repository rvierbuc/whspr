import React, { useEffect, useState } from 'react';
import { RecordPost } from './RecordPost';
import { useLoaderData } from 'react-router-dom';
import algoliasearch from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, useSearchBox, Configure } from 'react-instantsearch';
import { v4 as uuidv4 } from 'uuid';
import searchInsights from 'search-insights';


const generateUserToken = (): string => {
  return uuidv4();
};

const userToken = generateUserToken();

const searchClient = algoliasearch('2580UW5I69', 'b0f5d0cdaf312c18df4a45012c4251e4', {
  headers: {
    'X-Algolia-UserToken': userToken,
  },
});


const Hit = ({ hit, onSelect }: { hit: any; onSelect: (category: string[] | string) => void }) => {
  console.log('hits', hit); //the individual hit obj
  // this log logs each category but letter by letter
  // console.log('onselect hit', [...hit.category]);
  return (
    // TODO: issue, when you click on a hit, it just adds the input value to the selected categories instead of the hit value
    <article id='cat-hit' onClick={() => onSelect([hit.category])}
    style={{ border: '1px solid black', padding: '10px', margin: '10px' }}
    >
      {hit.category}
    </article>
  );
};

const CategorySearch = ({ onCategorySelect }: { onCategorySelect: (category: string[] | string) => void }) => {  
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('working', event.target.value, event);
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
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log('currentSearch', currentSearch);
    handleCategorySelection(currentSearch);
  };
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
            placeholder={'Add up to 5 categories!'}
            className='input-control'
            id='category-search'
          />
          </form>
          {/* create an input that holds the selected categories */}
        {currentSearch && <Hits className="cat-hits" hitComponent={(props) => <Hit {...props} onSelect={() => { handleCategorySelection(currentSearch); }} />} />}
          <input type="text" value={selectedCategories} readOnly={true} className='input-control' id='category-read-only'/>
        <Configure userToken={userToken} />
      </InstantSearch>
    </div>
  );
};

/**
 * DANIEL => filter and synthAudioChunks are being passed down with valid data from PostSynth
 * both props are then being passed into RecordPost to be saved to the cloud/db
 * FROM THE FEED => I have placeholders in Feed that keep RecordPost's functionality in place
 * In other words, your PostCard component still functions as it should.
 */
const PostCard = ({ audioContext, filter, synthAudioChunks }: { audioContext: AudioContext, filter: any, synthAudioChunks: Blob[] }) => {
  const [postCreated, setPostCreated] = useState(false);
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const user = useLoaderData();

  const openPost = () => {
    setPostCreated(!postCreated);
  };
  const handleCategorySelect = (selectedCategory: string | string[]) => {
    const array = Array.isArray(selectedCategory) ? selectedCategory : [selectedCategory];
    setCategories(array);
    // setCategories(selectedCategory);
  };
  return (
    <div>
      <div className="d-flex justify-content-center">
<button  
      type="button"
      className="btn btn-dark"
      style={{ margin: '15px' }}
      onClick={openPost}>
        {(!postCreated) ? 'Say something' : 'Nevermind'}
      </button>
      </div>
{postCreated && (
<div id="responsive-navbar-nav" className={postCreated ? 'show' : ''}>
<div className="d-flex justify-content-center">
          <input type="text"
          maxLength={22}
          placeholder="What's on your mind?"
          value={title} 
          onChange={(e) => { setTitle(e.target.value); }}
          className='input-control'
          />
          <CategorySearch onCategorySelect={handleCategorySelect}/>
          </div>
<RecordPost
synthAudioChunks={synthAudioChunks}
filter={filter}
user={user}
audioContext={audioContext}
title={title}
categories={categories}
openPost={openPost}
/>
</div>
)}

  </div>
  );
};

export default PostCard;
