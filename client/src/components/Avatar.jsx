import React from 'react'
import { Container, Image } from 'react-bootstrap'
import profileImage from '../assets/default-profile.jpg'
import { Avatar } from "@mui/material";


export default function UserAvatar({ name, email }) {
    return (
        <Container className={'d-flex flex-column justify-content-center align-items-center p-3'}>
            <Avatar className={'p-5'} style={{ fontSize: '3rem' }}>JD</Avatar>
            <div className={'pt-2'} style={{ fontSize: '1.5rem'}}>{name ? name : 'User Name'}</div>
            <div className={'pb-2'} style={{ color: "gray" }}>{email ? email : 'example@domain.com'}</div>
        </Container>
    )
}