import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, Outlet } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
// import '../style/style.scss'
import Search from './Search';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    setIsOpen(() => !isOpen);
    navigate(path);
  };
  
  const expand = 'false';
  return (
    <>

        <Navbar key={expand} expand={expand} className="navbar">
          <Container fluid>
            <Navbar.Brand href="/protected/feed"><img 
            src={require('../style/whspr-logo.png')}
            width={100}
            height={100}
            className="d-inline-block align-top"
            alt="whspr logo"
            style={{ cursor: 'pointer', margin: '10px' }}
            /></Navbar.Brand>
            <Navbar.Toggle onClick={() => { setIsOpen(() => !isOpen); }} aria-controls={`offcanvasNavbar-expand-${expand}`} style={{ backgroundColor: '#e1e1e5' }} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
              show={isOpen}
              className='card'
            >
              <Offcanvas.Header style={{ color: '#e1e1e5', cursor: 'pointer' }} onClick={() => { setIsOpen(() => !isOpen); }} >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
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
                 <Nav.Link onClick={() => handleNavigation('/protected/feed')}>Feed</Nav.Link>
                 <Nav.Link onClick={() => handleNavigation('/protected/profile')}>My Profile</Nav.Link>
                 <Nav.Link onClick={() => handleNavigation('/protected/room')}>Room</Nav.Link>
                <Nav.Link onClick={() => handleNavigation('/protected/WhsprAI')}>Whspr AI</Nav.Link>
                 </Nav>
                   <Search />
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    </>
  );
  // return (
  //   <div>
  //     <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  //       <Container>
  //         <Navbar.Brand>
  //           <img 
  //           src={require('../style/whspr-logo.png')}
  //           width={100}
  //           height={100}
  //           className="d-inline-block align-top"
  //           alt="whspr logo"
  //           onClick={() => toggleMenu()}
  //           style={{ cursor: 'pointer' }}
  //           />
  //           {' '}
  //           </Navbar.Brand>
  //           <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setShowMenu(!showMenu)}>
  //             </Navbar.Toggle>
  //           <Navbar.Collapse id="responsive-navbar-nav" className={showMenu ? 'show' : ''}>
  //             <Nav className="ml-auto">
  //               <Nav.Link onClick={() => handleNavigation('/protected/feed')} >Home</Nav.Link>
  //               {/* <Nav.Link onClick={() => handleNavigation('/protected/post')}>Post</Nav.Link> */}
  //               <Nav.Link onClick={() => handleNavigation('/protected/conch')}>Magic Conch</Nav.Link>
  //               <Nav.Link onClick={() => handleNavigation('/protected/feed')}>Feed</Nav.Link>
  //               <Nav.Link onClick={() => handleNavigation('/protected/profile')}>Profile</Nav.Link>
  //               <Nav.Link onClick={() => handleNavigation('/protected/synthesize')}>Synthesize</Nav.Link>
  //               <Nav.Link onClick={() => handleNavigation('/protected/room')}>Room</Nav.Link>
  //               <Nav.Link onClick={() => handleNavigation('/protected/WhsprAI')}>Whspr AI</Nav.Link>
  //               </Nav>
  //                 <Search />
  //             </Navbar.Collapse>
  //         </Container>
  //     </Navbar>
  //     {/* <div className="outlet">
  //       <Outlet />
  //     </div> */}
  //   </div>
  // );
};
{ /* <Nav className="justify-content-end flex-grow-1 pe-3">
<Nav.Link href="#action1">Home</Nav.Link>
<Nav.Link href="#action2">Link</Nav.Link>
<NavDropdown
  title="Dropdown"
  id={`offcanvasNavbarDropdown-expand-${expand}`}
>
  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
  <NavDropdown.Item href="#action4">
    Another action
  </NavDropdown.Item>
  <NavDropdown.Divider />
  <NavDropdown.Item href="#action5">
    Something else here
  </NavDropdown.Item>
</NavDropdown>
</Nav>
<Form className="d-flex">
<Form.Control
  type="search"
  placeholder="Search"
  className="me-2"
  aria-label="Search"
/>
<Button variant="outline-success">Search</Button>
</Form> */ }
export default NavBar;
