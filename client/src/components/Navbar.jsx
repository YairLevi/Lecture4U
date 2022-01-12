import React from "react";
import {Container, Navbar, Nav, NavDropdown, Form, Button} from "react-bootstrap";


export const NavbarComp = () => {
    return (
        <Navbar style={{padding: 15, boxShadow: '10 solid'}} bg="white" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Lecture4U</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#about">About</Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <Nav.Link style={{color: 'black'}} href="#sign-up">Sign Up</Nav.Link>
                        <Button variant="primary">Sign In</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComp;