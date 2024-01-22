import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, Outlet, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router';

// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
// import '../style/style.scss'
import Search from './Search';
import { displayPartsToString } from 'typescript';
import { singularize } from 'sequelize/types/utils';

const NavBar = ({ notificationCount, setNotificationCount, getNotificationCount }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const { type }: Readonly<Params<string>> = useParams();
  const [logo, setLogo] = useState<any>(require('../style/whspr-logo.png'));
  const location = useLocation();
  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    setIsOpen(() => !isOpen);
    navigate(path);
  };

  const logout = () => {
    window.location.href = '/logout';
  };
  const close = () => {
    setShow(false);
  };

  const showModal = () => {
    setShow(true);
  };

  const expand = 'false';

  

  useEffect(() => {
    if (type === 'explore') {
      setLogo(require('../style/explore-logo.png'));
    } else if (type === 'following') {
      setLogo(require('../style/following-logo.png'));
    } else if (location.pathname === '/protected/inbox') {
      setLogo(require('../style/inbox-logo.png'));
    } else if (location.pathname === '/protected/radio') {
      setLogo(require('../style/radio-logo.png'));
    } else if (location.pathname === '/protected/WhsprAI') {
      setLogo(require('../style/AI-logo.png'));
    } else if (!type) {
      setLogo(require('../style/whspr-logo.png'));
      console.log('use location', location);
    }
    
  });
  return (
    <>
      <Navbar key={expand} expand={expand} className="navbar">
        <Container fluid>
          <Navbar.Brand href="/protected/feed/following">
            <img
              src={logo}
              width="auto"
              height={100}
              className="d-inline-block align-top"
              alt="whspr logo"
              style={{ cursor: 'pointer', margin: '10px' }}
            />
          </Navbar.Brand>
          <Navbar.Toggle
            onClick={() => {
              setIsOpen(() => !isOpen);
              getNotificationCount();
            }}
            aria-controls={`offcanvasNavbar-expand-${expand}`}
            style={{
              color: '#e1e1e5',
              borderColor: '#e1e1e5',
              borderWidth: 'medium',
              margin: '10px',
            }}
          >
            <div>
              {notificationCount > 0 ? 
            <svg style={{ position: 'absolute', top: '30px', right: '3px' }} xmlns="http://www.w3.org/2000/svg" fill="rgb(54, 89, 169)" viewBox="0 0 24 24" width="45" height="45">
                          <filter id="shadow">
                            <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" />
                          </filter>
                          <g filter="url(#shadow)">
                            <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>  
                          </g>
                        </svg>
                : ''}
            <svg
            xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
              >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                />
            </svg>
                </div>
          </Navbar.Toggle>
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
            show={isOpen}
            className="card"
            onHide={() => setIsOpen(false)}
          >
            <Offcanvas.Header
              style={{ color: '#e1e1e5', cursor: 'pointer' }}
              onClick={() => {
                setIsOpen(() => !isOpen);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-x-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="ml-auto" style={{ color: '#e1e1e5', fontFamily: 'headerFont', fontSize: '2rem', color:'#e1e1e1' }}>
                {/* <Nav.Link onClick={() => handleNavigation('/protected/feed')} >Home</Nav.Link> */}
                {/* <Nav.Link onClick={() => handleNavigation('/protected/post')}>Post</Nav.Link> */}
                <Nav.Link
                  onClick={() => handleNavigation('/protected/synthesize')}
                >
                  Say Something
                </Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/inbox')}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div>
                    Inbox
                  </div>
                  {notificationCount > 0 
                    ? <div >
                        <svg style={{ position: 'absolute', top: '125px', right: '255px' }} xmlns="http://www.w3.org/2000/svg" fill="rgb(54, 89, 169)" viewBox="0 0 24 24" width="45" height="45">
                          <filter id="shadow">
                            <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2" />
                          </filter>
                          <g filter="url(#shadow)">
                            <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>  
                          </g>
                        </svg>
                        <div style={{ position: 'absolute', fontSize: '.75rem', fontFamily: 'sans-serif', top: '138px', right: '271px' }} >
                          {notificationCount}
                        </div>
                      </div> 
                    : <div></div>}
                  </div>
                
                </Nav.Link>
               
                <Nav.Link
                  onClick={() => handleNavigation('/protected/feed/explore')}
                >
                  Explore
                </Nav.Link>
                <Nav.Link
                  onClick={() => handleNavigation('/protected/feed/following')}
                >
                  Following
                </Nav.Link>
                <Nav.Link
                  onClick={() => handleNavigation('/protected/profile')}
                >
                  My Profile
                </Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/radio')}>
                  Radio
                </Nav.Link>
                <Nav.Link
                  onClick={() => handleNavigation('/protected/WhsprAI')}
                >
                  Whspr AI
                </Nav.Link>
                <Nav.Link onClick={() => showModal()}>Logout</Nav.Link>
                <Search />
              </Nav>
              <Modal show={show} onHide={close}>
                <Modal.Header closeButton>
                  <Modal.Title>You are about to logout</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <button
                    onClick={logout}
                    type="button"
                    className="btn btn-danger"
                  >
                    Logout
                  </button>
                  <button className="btn btn-dark" onClick={close}>
                    Nevermind
                  </button>
                </Modal.Footer>
              </Modal>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
