import { Container, Button, FormControl } from 'react-bootstrap'
import { useState } from "react";


export default function ForumTopBar({ onClick, onChange }) {

    return (
        <Container className={'p-1 d-flex border-bottom'}>
            <Button className={'me-1'} onClick={onClick}>New</Button>
            <FormControl placeholder={'Search...'} onChange={onChange}/>
        </Container>
    )
}