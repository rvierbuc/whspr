import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div>
      <nav>
        <Link to='/protected/synthesize'>Synthesize</Link>
      </nav>
    </div>
  );
};

export default NavBar;