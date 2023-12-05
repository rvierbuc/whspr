import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div>
      <nav>
        <Link to='/protected/synthesize'>Synthesize</Link>
        <Link to='/protected/recordPost'>Record Post</Link>
      </nav>
    </div>
  );
};

export default NavBar;