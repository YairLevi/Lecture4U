import React from "react";
import {Container, Navbar as Bar, Nav, NavDropdown, Form, Button} from "react-bootstrap";
import './Logo.scss'
import { useAuth } from "../../contexts/AuthContext";


export default function Navbar(props) {
    const { currentUser } = useAuth()

    return (
        <Bar className={"p-2 border-bottom shadow-sm"} bg={"white"} expand="md" sticky={"top"}>
            <Container>
                <Bar.Brand href="/">
                    <div className={'logo-lobby'} />
                </Bar.Brand>
                <Bar.Toggle aria-controls="basic-Bar-nav" />
                <Bar.Collapse id="basic-Bar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#about">About</Nav.Link>
                        <Nav.Link href="#contact">Contact</Nav.Link>
                    </Nav>
                    <Form className="d-flex">
                        <Nav.Link className="me-2 border border-black rounded text-dark" href="sign-up">Sign Up</Nav.Link>
                        <Nav.Link className="rounded bg-primary text-light" variant="white" href="sign-in">
                            {
                                currentUser ? 'Go To Dashboard' : 'Sign In'
                            }
                        </Nav.Link>
                    </Form>
                </Bar.Collapse>
            </Container>
        </Bar>
    )
}