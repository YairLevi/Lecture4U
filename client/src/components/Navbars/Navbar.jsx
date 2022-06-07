import React from "react";
import {Container, Navbar as Bar, Nav, NavDropdown, Form, Button} from "react-bootstrap";
import './Logo.scss'


export default function Navbar(props) {
    return (
        <Bar className={"p-2 border-bottom shadow-sm"} bg={"white"} expand="md" sticky={"top"}>
            <Container>
                <Bar.Brand href="/">
                    <div className={'logo'} />
                </Bar.Brand>
                <Bar.Toggle aria-controls="basic-Bar-nav" />
                <Bar.Collapse id="basic-Bar-nav">
                    <Nav className="me-auto">
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
                        <Nav.Link className="me-2 border border-black rounded text-dark" href="sign-up">Sign Up</Nav.Link>
                        <Nav.Link className="rounded bg-primary text-light" variant="white" href="sign-in">Sign In</Nav.Link>
                    </Form>
                </Bar.Collapse>
            </Container>
        </Bar>
    )
}