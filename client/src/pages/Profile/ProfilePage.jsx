import React, { useEffect, useState } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap'
import AddPhoto from "./modals/AddPhoto";
import EditProfile from "./modals/EditProfile";
import requests from "../../helpers/requests";
import Avatar from "@mui/material/Avatar";
import { useAuth } from '../../contexts/AuthContext'


export default function ProfilePage() {
    const [openImage, setOpenImage] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const { currentUser } = useAuth()


    return (
        <>
            <Container className={'p-3'}>
                <h3 style={{fontWeight: "normal"}}>Profile</h3>
                <Container className={'col-md-6 col-sm-12'}>
                    <Container className={'d-flex flex-column justify-content-center align-items-center p-3'}>
                        <Avatar className={'mb-3'} src={currentUser.profileImage?.url[0]} sx={{ width: 100, height: 100 }}/>
                        <Button onClick={() => setOpenImage(true)}>Add Photo</Button>
                    </Container>
                    <Form>
                        <Form.Group className={'mb-3'}>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control value={currentUser.firstName} disabled/>
                        </Form.Group>
                        <Form.Group className={'mb-3'}>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control value={currentUser.lastName} disabled/>
                        </Form.Group>
                        <Form.Group className={'mb-3'}>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control value={currentUser.email} disabled/>
                        </Form.Group>
                    </Form>
                    <Button onClick={() => setOpenEdit(true)}>Edit Profile</Button>
                </Container>
            </Container>

            <EditProfile show={openEdit} onHide={() => setOpenEdit(false)} />
            <AddPhoto show={openImage} onHide={() => setOpenImage(false)} />
        </>
    )
}