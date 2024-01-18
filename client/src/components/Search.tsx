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
// require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaDeleteLeft } from 'react-icons/fa6';
const generateUserToken = (): string => {
  return uuidv4();
};

// TODO:
interface EnvironmentVariables {
  APP_ID: string;
  ADMIN_API_KEY: string;
}
interface SearchPropTypes {
  children: React.ReactNode;
}

const userToken = generateUserToken();

const searchClient = algoliasearch(
  '2580UW5I69',
  'b0f5d0cdaf312c18df4a45012c4251e4',
  {
    headers: {
      'X-Algolia-UserToken': userToken,
    },
  },
);

// function Hit({ hit }) {
//   const { hits } = useHits(); // the array of hits
//   console.log('hits', hits);//the individual hit obj
//   const { refine } = useSearchBox();
//   console.log('refine', refine);

//   return (
//     <article>
//       <img src={hit.profileImgUrl || ''} alt={hit.name} style={{ width: 'auto', height: '100px', objectFit: 'scale-down' }} />
//       <Link to={`/protected/profile/${hit.objectID}`}>{hit.username}</Link>

// <p>{hit.title || ''}</p>

//     </article>
//   );
// }

const Search: React.FC = () => {
  const [currentSearch, setCurrentSearch] = useState<string>('');
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    searchQuery: string;
  }

  const Hit: React.FC<HitProps> = ({ hit, searchQuery }) => {
    const { hits } = useHits(); // the array of hits
    const { query } = useSearchBox();
    console.log('search query', query);
    console.log('hit prop searchQuery pass down', searchQuery);
    console.log('hit inside of hit inside of search', hit);
    console.log('hits inside of hit comp ins earch', hits);
    // filter the hits based on the current search
    const filteredHits = hits.filter((individualHit) => {
      return individualHit.username
        .toLowerCase()
        .includes(currentSearch.toLowerCase());
    });
    console.log('curr search and indiv hits in hit', currentSearch, filteredHits);
    // limit the number of hits to only display how many are in the filtered hits array
    return (
      <>
        {filteredHits.slice(0, 5).map((filteredHit, index) => {
          console.log('hit inside of filtered hits', hit);
          return (
            <article key={index}>
              {/* <img
                src={filteredHit.profileImgUrl || ''}
                alt={filteredHit.name}
                style={{
                  width: 'auto',
                  height: '100px',
                  objectFit: 'scale-down',
                }}
              /> */}
              <Link to={`/protected/profile/${hit.objectID}`}>
                {filteredHit.username}
              </Link>

              <p>{filteredHit.title || ''}</p>
            </article>
          );
        })}
      </>
    );
  };
  // useEffect(() => {
  //   console.log('current search', currentSearch);
  // }, []);

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="user_index"
      // initialUiState={{ searchBox: { query: currentSearch } }}
      searchState={{ query: currentSearch }}
      insights={true}
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
      <Hits hitComponent={(hit) => <Hit {...hit} searchQuery={currentSearch} />} className="card" />
      )}
      <Configure clickAnalytics={true} queryType="prefixLast" />
    </InstantSearch>
  );
};
export default Search;
