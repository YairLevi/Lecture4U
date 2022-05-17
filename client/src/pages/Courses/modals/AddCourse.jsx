import React, { useState } from 'react'
import { FormControl, Modal, Button, InputGroup } from 'react-bootstrap'
import { Spinner } from "react-bootstrap";

const CODE_LEN = 24

export default function AddCourse(props) {
    const [code, setCode] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleClick() {
        setLoading(true)
        setError(null)
        const options = {
            method: 'POST',
            headers: { 'Content-type': 'application/json', },
            credentials: 'include',
            body: JSON.stringify({ code })
        }
        const res = await fetch('http://localhost:8000/course/enroll', options)
        if (res.status !== 200) {
            setError("Invalid code")
        } else {
            setError('success')
        }
        setLoading(false)
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Enter Course Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    To add a course, you are required to have that course's ID.
                    This mechanism prevents users from entering private courses freely.
                </p>
                <InputGroup className={'mb-3'}>
                    <FormControl
                        placeholder={'Enter course code'}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <Button onClick={handleClick}>Check</Button>
                </InputGroup>
                {loading && <Spinner className={'m-3 align-self-center'} animation="border"/>}
                {error && <span className={'alert-danger p-2'}>{error}</span>}
            </Modal.Body>
        </Modal>
    )
}