import algoliasearch from 'algoliasearch/lite';
import React, { useState, useEffect} from 'react';
import { InstantSearch, SearchBox, Hits, Configure, useHits, useSearchBox } from 'react-instantsearch';
// require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
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

const searchClient = algoliasearch('2580UW5I69', 'b0f5d0cdaf312c18df4a45012c4251e4', {
  headers: {
    'X-Algolia-UserToken': userToken,
  }
});


function Hit({ hit }) {
  const { hits } = useHits(); // the array of hits
  // console.log('hits', hits);the individual hit obj
  // console.log('hit', hit.objectID); the id of the user in the db
  return (
    <article>
      <img src={hit.profileImgUrl || ''} alt={hit.name} style={{ width: 'auto', height: '100px', objectFit: 'scale-down' }}/>
      <Link to={`/protected/profile/${hit.objectID}`}>{hit.username}</Link>

      <p>{hit.title || ''}</p>

    </article>
  );
}
  //creating a custom search box to stuff into the navbar

const Search:React.FC = () => {
  const [currentSearch, setCurrentSearch] = useState<string>('');
  // const { refine } = useSearchBox();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('working', event.target.value, event);
    // console.log('userToken', userToken);
    setCurrentSearch(event.target.value);
    // refine(event.target.value);
  }
  return (
    <Form>
    <InstantSearch 
    searchClient={searchClient} 
    indexName="search_index"
    initialUiState={{ searchBox: { query: currentSearch } }}
    insights={true}
    >
      <Configure clickAnalytics={true} />
      <SearchBox onInput={handleSearchChange}/>
      {currentSearch && <Hits hitComponent={Hit} />}
    </InstantSearch>
      </Form>
  );
}
export default Search