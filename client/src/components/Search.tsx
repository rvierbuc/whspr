import algoliasearch from 'algoliasearch/lite';
import React, { useState, useEffect } from 'react';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  useHits,
  useSearchBox,
} from 'react-instantsearch';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaDeleteLeft } from 'react-icons/fa6';
// require('dotenv').config();
const generateUserToken = (): string => {
  return uuidv4();
};

// TODO:

interface SearchPropTypes {
  children: React.ReactNode;
}
interface EnvironmentVariables {
  ALGOLIA_APP_ID: string;
  ALGOLIA_ADMIN_API_KEY: string;
}
// const { ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY }: EnvironmentVariables = process.env as any;
// console.log('algolia app id', ALGOLIA_APP_ID);
// console.log('algolia admin api key', ALGOLIA_ADMIN_API_KEY);
// export const client = algoliasearch('L1DTWCU98D', 'bf531f95b4dd36ed1fc7eadf4c95cda6');
const userToken = generateUserToken();

const searchClient = algoliasearch(
  'L1DTWCU98D', //applicationID
  'bf531f95b4dd36ed1fc7eadf4c95cda6', //adminAPIKey
  {
    headers: {
      'X-Algolia-UserToken': userToken,
    },
  },
);

const Search: React.FC = () => {
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setCurrentSearch(event.target.value);
  };
  // moved hit comp into search comp to access current search
  interface HitProps {
    hit: {
      username: string;
      profileImgUrl: string;
      name: string;
      objectID: string;
      title: string;
    };
  }

  const Hit: React.FC<HitProps> = ({ hit }) => {
    const { hits } = useHits(); // the array of hits
    const { query } = useSearchBox();
    // console.log('search query', query);
    // console.log('hit prop searchQuery pass down', searchQuery);
    // console.log('hit inside of hit inside of search', hit);
    // console.log('hits inside of hit comp ins earch', hits);
    // filter the hits based on the current search
    const filteredHits = hits.filter((individualHit) => {
      return individualHit.username
        .toLowerCase()
        .includes(query.toLowerCase());
    });
    console.log('curr search and indiv hits in hit', currentSearch, query, filteredHits);
    // limit the number of hits to only display how many are in the filtered hits array
    return (
      <>
        {filteredHits.slice(0, 5).map((filteredHit, index) => {
          // console.log('hit inside of filtered hits', hit);
          return (
            <article key={index}>
              <Link to={`/protected/feed/profile/${hit.id}`}>
                {filteredHit.username}
              </Link>

              <p>{filteredHit.title || ''}</p>
            </article>
          );
        })}
      </>
    );
  };

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="user_index"
      // initialUiState={{ searchBox: { query: currentSearch } }}
      searchState={{ query: currentSearch }}
      insights={false}
      
    >
      {/* <SearchBox onInput={handleSearchChange}/> */}
      <div>
        <InputGroup>
          <InputGroup.Text id="basic-addon1">@/#</InputGroup.Text>
          <SearchBox
            onInput={handleSearchChange}
            value={currentSearch}
            submit={false}
            className="bg-dark"
            showReset={false}
          />
        </InputGroup>
      </div>
      {currentSearch && (
      <Hits hitComponent={(hit) => <Hit {...hit} />} className="card" />
      )}
      <Configure clickAnalytics={true} queryType="prefixLast" hitsPerPage={2} />
    </InstantSearch>
  );
};
export default Search;
