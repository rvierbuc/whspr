import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, Outlet } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {Modal, Form} from 'react-bootstrap'
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
// import '../style/style.scss'
import Search from './Search';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false)

  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    setIsOpen(() => !isOpen);
    navigate(path);
  };

  const logout = () => {
    window.location.href = '/logout'
  }
  const close = () => {
    setShow(false)
}

  const showModal = () => {
    setShow(true)
    
  }
  
  const expand = 'false';
  return (
    <>

      <Navbar key={expand} expand={expand} className="navbar">
        <Container fluid>
          <Navbar.Brand href="/protected/feed/following"><img
            src={require('../style/whspr-logo.png')}
            width={100}
            height={100}
            className="d-inline-block align-top"
            alt="whspr logo"
            style={{ cursor: 'pointer', margin: '10px' }}
          /></Navbar.Brand>
          <Navbar.Toggle onClick={() => { setIsOpen(() => !isOpen); }} aria-controls={`offcanvasNavbar-expand-${expand}`} style={{ color: '#e1e1e5', borderColor: '#e1e1e5', borderWidth: 'medium' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
            </svg>
            </Navbar.Toggle>
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
              show={isOpen}
              className='card'
            >
              <Offcanvas.Header style={{ color: '#e1e1e5', cursor: 'pointer' }} onClick={() => { setIsOpen(() => !isOpen); }} >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </Offcanvas.Header>
              <Offcanvas.Body>
              <Nav className="ml-auto" style={{ color: '#e1e1e5' }}>
                {/* <Nav.Link onClick={() => handleNavigation('/protected/feed')} >Home</Nav.Link> */}
                {/* <Nav.Link onClick={() => handleNavigation('/protected/post')}>Post</Nav.Link> */}
                <Nav.Link onClick={() => handleNavigation('/protected/synthesize')}>Say Something</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/conch')}>Magic Conch</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/feed/explore')}>Explore</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/profile')}>My Profile</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/radio')}>Radio</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/WhsprAI')}>Whspr AI</Nav.Link>
                 <Nav.Link onClick={() => showModal()}>Logout</Nav.Link>
                 </Nav>
                 <Modal
                show={show}
                onHide={close}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>You are about to logout</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <button 
                        onClick={logout}
                        type="button"
                        className='btn btn-danger'
                        >
                            Logout
                        </button>
                            <button className='btn btn-dark' onClick={close}>Nevermind</button>
                        </Modal.Footer>
                    


                </Modal>
                   <Search />
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    </>
  );

};

export default NavBar;
