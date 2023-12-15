import React, { useState } from 'react'
import { RecordPost } from './RecordPost'
import { useLoaderData } from 'react-router-dom'
import algoliasearch from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, useSearchBox, useHits, Configure } from 'react-instantsearch';
import { v4 as uuidv4 } from 'uuid';


const generateUserToken = (): string => {
  return uuidv4();
};

const userToken = generateUserToken();

const searchClient = algoliasearch('2580UW5I69', 'b0f5d0cdaf312c18df4a45012c4251e4', {
  headers: {
    'X-Algolia-UserToken': userToken,
  }
});

const Hit = ({ hit }) => {
  const { hits } = useHits(); // the array of hits
  // console.log('hits', hits); //the individual hit obj
  return (
    <article>
      {hit.category}
    </article>
  )};
const CategorySearch = () => {  
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(event.target.value);
  }
  return (
    <div>
      <InstantSearch 
      searchClient={searchClient} 
      indexName="category_index"
      initialUiState={{ searchBox: { query: currentSearch } }}
      >
        <SearchBox onInput={handleSearchChange} />
        {currentSearch && <Hits hitComponent={Hit} />}
        <Configure userToken={userToken} />
      </InstantSearch>
    </div>
  );
}

const PostCard = ({ audioContext }: { audioContext: BaseAudioContext }) => {
  const [postCreated, setPostCreated] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const user = useLoaderData()

  const openPost = () => {
    setPostCreated(!postCreated)
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
          <CategorySearch />
          </div>
<RecordPost
user={user}
audioContext={audioContext}
title={title}
category={category}
openPost={openPost}
/>
</div>
)}

  </div>
  )
}

export default PostCard
