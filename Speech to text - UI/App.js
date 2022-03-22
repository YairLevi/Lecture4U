import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, ButtonGroup, Container, Card, Nav, Navbar, Form} from "react-bootstrap"
import './App.css';
import React, {useState, useEffect} from 'react';
import NotificationForm from './Notification_Form'
import {Box, Modal, Typography} from "@mui/material";
import CustomizedDialogs from "./Dialog";
import RegistrationForm from "./RegistrationForm";
import FileUploader from "./FileUploader";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function App() {
    return (
        <div className="App">
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Speech to Text</Navbar.Brand>
                    <Nav className="me-auto">
                        <ButtonGroup aria-label="Basic example">

                            <FileUploader/>

                            <Button variant="outline-light">Download</Button>
                            <Button variant="outline-light">Transcribe</Button>
                            <CustomizedDialogs>
                                <RegistrationForm/>
                            </CustomizedDialogs>

                        </ButtonGroup>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
}

export default App;
