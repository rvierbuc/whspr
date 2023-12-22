// import algoliasearch from 'algoliasearch/lite';
// import React, { useState, useEffect } from 'react';
// import { InstantSearch, SearchBox, Hits, Configure, useHits, useSearchBox } from 'react-instantsearch';
// // require('dotenv').config();
// import { v4 as uuidv4 } from 'uuid';
// import { Link } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
// const generateUserToken = (): string => {
//   return uuidv4();
// };

// // TODO:
// interface EnvironmentVariables {
//   APP_ID: string;
//   ADMIN_API_KEY: string;
// }
// interface SearchPropTypes {
//   children: React.ReactNode;
// }



// const userToken = generateUserToken();

// const searchClient = algoliasearch('2580UW5I69', 'b0f5d0cdaf312c18df4a45012c4251e4', {
//   headers: {
//     'X-Algolia-UserToken': userToken,
//   },
// });


// function Hit({ hit }) {
//   const { hits } = useHits(); // the array of hits
//   console.log('hits', hits);//the individual hit obj
//   const { refine } = useSearchBox();
//   console.log('refine', refine);

//   return (
//     <article>
//       <img src={hit.profileImgUrl || ''} alt={hit.name} style={{ width: 'auto', height: '100px', objectFit: 'scale-down' }} />
//       <Link to={`/protected/profile/${hit.objectID}`}>{hit.username}</Link>

//       <p>{hit.title || ''}</p>

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
  }

  const Hit: React.FC<HitProps> = ({ hit }) => {
    const { hits } = useHits(); // the array of hits
    const { refine } = useSearchBox();
    
    console.log('hits', hits); // the individual hit obj
    console.log('currentSearch inside of hits component', currentSearch);

    return (
      <article>
        <img
          src={hit.profileImgUrl || ''}
          alt={hit.name}
          style={{ width: 'auto', height: '100px', objectFit: 'scale-down' }}
        />
        <Link to={`/protected/profile/${hit.objectID}`}>{hit.username}</Link>

        <p>{hit.title || ''}</p>
      </article>
    );
  };
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="search_index"
      // initialUiState={{ searchBox: { query: currentSearch } }}
      searchState={{ query: currentSearch }}
      insights={true}
    >
      {/* <SearchBox onInput={handleSearchChange}/> */}
      <Form inline className='bg-dark'>
        <InputGroup>
          <InputGroup.Text id="basic-addon1">@/#</InputGroup.Text>
          <Form.Control
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-addon1"
            onChange={handleSearchChange}
            value={currentSearch}
          />
        </InputGroup>
      </Form>
      {currentSearch && <Hits hitComponent={Hit} />}
      <Configure clickAnalytics={true} queryType="prefixLast" />
    </InstantSearch>
  );
};
export default Search;