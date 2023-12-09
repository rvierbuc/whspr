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
        <Link className="mx-3" to='/protected/synthesize'>Synthesize</Link>

        <Link className="mx-3" to='/protected/dashboard'>WaveSurfer</Link>

        <Link className="mx-3" to='/protected/post'>Record Post</Link>
        <Link className="mx-3" to='/protected/feed'>Feed</Link>

        <Link className="mx-3" to='/protected/profile'>User Profile</Link>

      </nav>
      {/* <div className="outlet">
        <Outlet />
      </div> */}
    </div>
  );
};

export default NavBar;