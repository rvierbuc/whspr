import React from 'react';
import { Link, Navigate, useNavigate, Outlet } from 'react-router-dom';

const NavBar = () => {

  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  }

  return (
    <div>
      <nav>
      <Link to='/protected/room'>Room</Link>
        <Link to='/protected/synthesize'>Synthesize</Link>

        <Link to='/protected/dashboard'>WaveSurfer</Link>

        <Link to='/protected/post'>Record Post</Link>
        <Link to='/protected/feed'>Feed</Link>

      </nav>
      {/* <div className="outlet">
        <Outlet />
      </div> */}
    </div>
  );
};

export default NavBar;