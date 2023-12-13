import algoliasearch from 'algoliasearch/lite';
import React, { useState, useEffect} from 'react';
import { InstantSearch, SearchBox, Hits, Configure, useHits } from 'react-instantsearch';
// require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import WaveSurferComponent from './WaveSurfer';

const generateUserToken = (): string => {
  return uuidv4();
};

// TODO:
interface EnvironmentVariables {
  APP_ID: string;
  ADMIN_API_KEY: string;
}



const userToken = generateUserToken();

const searchClient = algoliasearch('2580UW5I69', 'b0f5d0cdaf312c18df4a45012c4251e4', {
  headers: {
    'X-Algolia-UserToken': userToken,
  }
});


function Hit({ hit }) {
  const { hits } = useHits();
  console.log('hits', hits);
  return (
    <article>
      <img src={hit.profileImgUrl || ''} alt={hit.name} style={{ width: 'auto', height: '100px', objectFit: 'scale-down' }}/>
      <p>{hit.username}</p>
      <p>{hit.title || ''}</p>
    </article>
  );
}

const Search:React.FC = () => {
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('working', event.target.value, event);
    console.log('userToken', userToken);
    setCurrentSearch(event.target.value);
  }
  return (
    <InstantSearch 
    searchClient={searchClient} 
    indexName="search_index"
    initialUiState={{ searchBox: { query: currentSearch } }}
    >
      <SearchBox onInput={handleSearchChange}/>
      {currentSearch && <Hits hitComponent={Hit} />}
      <Configure userToken={userToken} />
    </InstantSearch>
  );
}
export default Search