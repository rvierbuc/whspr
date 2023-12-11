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
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <img 
            src={require('../style/whspr-logo.png')}
            width={100}
            height={100}
            className="d-inline-block align-top"
            alt="whspr logo"
            onClick={() => toggleMenu()}
            style={{cursor: 'pointer'}}
            />
            {' '}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setShowMenu(!showMenu)}>
              </Navbar.Toggle>
            <Navbar.Collapse id="responsive-navbar-nav" className={showMenu ? 'show' : ''}>
              <Nav className="ml-auto">
                <Nav.Link onClick={() => handleNavigation('/protected/feed')} >Home</Nav.Link>
                {/* <Nav.Link onClick={() => handleNavigation('/protected/post')}>Post</Nav.Link> */}
                <Nav.Link onClick={() => handleNavigation('/protected/feed')}>Feed</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/profile')}>Profile</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/synthesize')}>Synthesize</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/room')}>Room</Nav.Link>
                </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>
      {/* <div className="outlet">
        <Outlet />
      </div> */}
    </div>
  );
};

export default NavBar;