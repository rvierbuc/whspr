import algoliasearch from 'algoliasearch/lite';
import React from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';

const searchClient = algoliasearch('APP ID', 'Admin API Key');
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
    <InstantSearch searchClient={searchClient} indexName="user_index">
      <SearchBox />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  );
}
export default Search