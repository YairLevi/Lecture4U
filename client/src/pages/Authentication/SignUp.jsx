import React, { useState } from 'react';
import { Button, Card, Container, Form, NavLink, Spinner } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../hooks/useLoading";
import { ERRORS } from "../../helpers/errors";
import { useNav } from "../../contexts/NavContext";
import requests from "../../helpers/requests";


export default function SignIn() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { register, checkIfExists } = useAuth()
    const { fullNav } = useNav()
    const [error, setError] = useState()

    const [loading, action] = useLoading(async () => {
        setError(null)
        if (firstName === '' || lastName === '' || email === '' || password === '') return setError(ERRORS.EMPTY_NAME)
        const isValidated = await requests.get('/mail-validate', { email })
        if (!isValidated) return setError(ERRORS.INVALID_MAIL)
        const isTaken = await checkIfExists(email)
        if (isTaken) return setError(ERRORS.EMAIL_TAKEN)
        const result = await register({ firstName, lastName, email, password })
        if (!result) return setError(ERRORS.GENERAL_ERROR)
        fullNav('/sign-in', {}, false)
    })

    async function handleClick(e) {
        e.preventDefault()
        await action()
    }

    return (
        <Container className={"w-100 vh-100 d-flex justify-content-center align-items-center flex-column"}>
            <Card className={"w-100"} style={{ maxWidth: 400 }}>
                <Card.Body className={"p-5"}>
                    <h1 className={"mb-3 text-center"}>Sign Up</h1>
                    <Form>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type={"text"}
                                          onChange={(e) => setFirstName(e.target.value)} required/>
                        </Form.Group>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type={"text"}
                                          onChange={(e) => setLastName(e.target.value)} required/>
                        </Form.Group>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type={"email"}
                                          onChange={(e) => setEmail(e.target.value)} required/>
                        </Form.Group>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type={"password"}
                                          onChange={(e) => setPassword(e.target.value)} required/>
                        </Form.Group>
                        { error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                        <Container className={'d-flex justify-content-center align-items-center'}>
                            {loading && <Spinner className={'m-3'} animation="border"/>}
                        </Container>
                    </Form>
                    <div className={'d-flex'}>
                        <NavLink className={'me-auto ps-0'} href={"/sign-in"}>Got An Account?</NavLink>
                        <Button className={"d-flex align-self-md-center"}
                                disabled={loading}
                                type={"submit"}
                                onClick={handleClick}>Create Account</Button>
                    </div>
                </Card.Body>
            </Card>

            <NavLink href={'/'}>Back to Home Page</NavLink>
        </Container>
    )
}