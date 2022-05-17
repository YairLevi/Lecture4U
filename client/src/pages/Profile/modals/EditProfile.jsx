import React, { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import requests from "../../../helpers/requests";
import { useLoading } from "../../../hooks/useLoading";
import { useRefresh } from "../../../hooks/useRefresh";


export default function EditProfile(props) {
    const { currentUser } = useAuth()
    const [firstName, setFirstName] = useState(currentUser.firstName)
    const [lastName, setLastName] = useState(currentUser.lastName)
    const [email, setEmail] = useState(currentUser.email)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState()
    const refresh = useRefresh()

    const [loading, editProfile] = useLoading(async () => {
        let body = { firstName, lastName, email, }
        if (password) body = {...body, password}
        const res = await requests.post('/profile/edit', body)
        return res.status === 200
    })

    function isModified() {
        const values = { firstName, lastName, email }
        for (const key of Object.keys(values))
            if (currentUser[key] !== values[key])
                return true
        return false
    }

    async function handleClick() {
        setError(null)
        if (password !== confirmPassword) return setError('Passwords do not match')
        if (!isModified()) return props.onHide()
        const result = await editProfile()
        if (!result) return setError('Something went wrong. Please try again later')
        refresh()
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control value={firstName} onChange={e => setFirstName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control value={lastName} onChange={e => setLastName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control value={email} onChange={e => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type={'password'} onChange={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Text>
                        To reset the password, confirm the new password.
                    </Form.Text>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type={'password'} onChange={e => setConfirmPassword(e.target.value)}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className={'d-flex'}>
                {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                {loading && <Spinner animation={"border"}/>}
                <Button onClick={handleClick} disabled={loading}>
                    Apply Change
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
