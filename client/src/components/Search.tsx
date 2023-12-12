import algoliasearch from 'algoliasearch/lite';
import React from 'react';
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch';
// require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';

const generateUserToken = (): string => {
  return uuidv4();
};

// TODO:
interface EnvironmentVariables {
  APP_ID: string;
  ADMIN_API_KEY: string;
}
// const { APP_ID, ADMIN_API_KEY }: EnvironmentVariables = process.env as any;



const userToken = generateUserToken();

const searchClient = algoliasearch('2580UW5I69', 'b0f5d0cdaf312c18df4a45012c4251e4', {
  headers: {
    'X-Algolia-UserToken': userToken,
  }
});


function Hit({ hit }) {
  return (
    <article>
      <img src={hit.profileImgUrl} alt={hit.name} style={{ width: 'auto', height: '100px', objectFit: 'scale-down' }}/>
      <p>{hit.username}</p>
    </article>
  );
}
const Search = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="search_index">
      <SearchBox />
      <Hits hitComponent={Hit} />
      <Configure userToken={userToken} />
    </InstantSearch>
  );
}
export default Search