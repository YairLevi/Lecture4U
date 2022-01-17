import React from "react";
import {Container, Navbar as Bar, Nav, NavDropdown, Form, Button} from "react-bootstrap";


export default function Navbar(props) {
    return (
        <Bar className={"pt-xl-3 pb-xl-3 shadow-none"} expand="lg">
            <Container>
                <Bar.Brand href="#home">Lecture4U</Bar.Brand>
                <Bar.Toggle aria-controls="basic-Bar-nav" />
                <Bar.Collapse id="basic-Bar-nav">
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
                        <Nav.Link style={{color: 'black'}} href="sign-up">Sign Up</Nav.Link>
                        <Button variant="primary" href={"sign-in"}>Sign In</Button>
                    </Form>
                </Bar.Collapse>
            </Container>
        </Bar>
    );
}