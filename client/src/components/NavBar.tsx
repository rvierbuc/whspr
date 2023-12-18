import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, Outlet } from 'react-router-dom';
import Nav  from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
// import '../style/style.scss'

const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  }
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  return (
    <div>
      <nav>
      <Link className="mx-3" to='/protected/radio'>Radio</Link>

        <Link className="mx-3" to='/protected/synthesize'>Synthesize</Link>

        <Link className="mx-3" to='/protected/conch'>Magic Conch</Link>

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