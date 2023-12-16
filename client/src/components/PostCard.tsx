import React, { useState } from 'react'
import { RecordPost } from './RecordPost'
import { useLoaderData } from 'react-router-dom'
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
  }
});


const Hit = ({ hit, onSelect }: { hit: any; onSelect: (category: string[] | string) => void }) => {
  // console.log('hits', hits); //the individual hit obj
  return (
    <article onClick={() => onSelect([hit.category])}>
      {hit.category}
    </article>
  )};
// const CategorySearch = ({ onCategorySelect }: { onCategorySelect: (category: string) => void }) => {  
//   const [currentSearch, setCurrentSearch] = useState<string>('');
//   const [selectedCategory, setSelectedCategory] = useState<string>('');
//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     console.log('working', event.target.value, event);
//     setCurrentSearch(event.target.value);
//   }
//   const handleCategorySelection = (category: string) => {
//     // console.log('category', category);
//     setSelectedCategory(category);
//     onCategorySelect(category);
//   }
//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     // console.log('currentSearch', currentSearch);
//     setCurrentSearch('');
//     setSelectedCategory(currentSearch);
//     onCategorySelect(currentSearch);
//   }
//   return (
//     <div>
//       <InstantSearch 
//       searchClient={searchClient} 
//       indexName="category_index"
//       initialUiState={{ searchBox: { query: currentSearch } }}
//       >
//         {/* <SearchBox onInput={handleSearchChange} placeholder={'' || selectedCategory} className='input-control'/> */}
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             value={currentSearch}
//             onInput={handleSearchChange}
//             placeholder={'Add up to 5 categories!' || selectedCategory}
//             className='input-control'
//             id='category-search'
//           />
//           </form>
//         {currentSearch && <Hits hitComponent={(props) => <Hit {...props} onSelect={handleCategorySelection} />} />}
//         <Configure userToken={userToken} />
//       </InstantSearch>
//     </div>
//   );
// }
const CategorySearch = ({ onCategorySelect }: { onCategorySelect: (category: string[] | string) => void }) => {  
  const [currentSearch, setCurrentSearch] = useState<string[] | string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('working', event.target.value, event);
    setCurrentSearch(event.target.value);
  }
  const handleCategorySelection = (category: string[] | string) => {
    // console.log('category', category);
    const selectedCategory = typeof category === 'string' ? [category] : category;
    setSelectedCategories(selectedCategory);
    onCategorySelect(selectedCategory);
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log('currentSearch', currentSearch);
    if (typeof currentSearch === 'string') {
      setCurrentSearch('');
      setSelectedCategories([currentSearch]);
      onCategorySelect(currentSearch);
    } else {
      setCurrentSearch('');
      setSelectedCategories(currentSearch);
      onCategorySelect(currentSearch);
    }
  }
  return (
    <div>
      <InstantSearch 
      searchClient={searchClient} 
      indexName="category_index"
      initialUiState={{ searchBox: { query: Array.isArray(selectedCategories) ? selectedCategories.join(', ') : selectedCategories } }}
      >
        {/* <SearchBox onInput={handleSearchChange} placeholder={'' || selectedCategory} className='input-control'/> */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={currentSearch}
            onInput={handleSearchChange}
            placeholder={'Add up to 5 categories!' || selectedCategories.join(', ')}
            className='input-control'
            id='category-search'
          />
          </form>
        {currentSearch && <Hits hitComponent={(props) => <Hit {...props} onSelect={handleCategorySelection} />} />}
        <Configure userToken={userToken} />
      </InstantSearch>
    </div>
  );
}

const PostCard = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [postCreated, setPostCreated] = useState(false)
  const [title, setTitle] = useState('')
  const [categories, setCategories] = useState<string[] | string>('')
  const user = useLoaderData()

  const openPost = () => {
    setPostCreated(!postCreated)
  }
  const handleCategorySelect = (selectedCategory: string[] | string) => {
    // console.log('selectedCategory', selectedCategory);
    if (typeof selectedCategory === 'string') {
      setCategories(selectedCategory);
    } else {
      setCategories(selectedCategory[0]);
    }
  }
  return (
    <div>
      <div className="d-flex justify-content-center">
<button  
      type="button"
      className="btn btn-dark"
      style={{margin:'15px'}}
      onClick={openPost}>
        Write Post
      </button>
      </div>
{postCreated && (
<div id="responsive-navbar-nav" className={postCreated ? 'show' : ''}>
<div className="d-flex justify-content-center">
          <input type="text"
          maxLength={22}
          placeholder="What's on your mind?"
          value={title} 
          onChange={(e) => { setTitle(e.target.value) }}
          className='input-control'
          />
          <CategorySearch onCategorySelect={handleCategorySelect}/>
          </div>
<RecordPost
user={user}
audioContext={audioContext}
title={title}
categories={categories}
openPost={openPost}
/>
</div>
)}

  </div>
  )
}

export default PostCard
