import React, { useState } from 'react';
import { Container, Card, Button, Form, NavLink, Spinner } from 'react-bootstrap';
import { useAuth } from "../../contexts/AuthContext";
import { ERRORS } from "../../helpers/errors";
import { useLoading } from "../../hooks/useLoading";

export default function SignIn(props) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState()
    const [password, setPassword] = useState('')
    const { login } = useAuth()

    const [loading, action] = useLoading(async () => {
        setError(null)
        const res = await login(email, password)
        if (!res) setError(ERRORS.INCORRECT_CREDENTIALS)
    })

    function handleClick(e) {
        e.preventDefault()
        action()
    }

    return (
        <Container className={"w-100 vh-100 d-flex justify-content-center align-items-center flex-column"}>
            <Card className={"w-100"} style={{ maxWidth: 400 }}>
                <Card.Body className={"p-5"}>
                    <h1 className={"mb-3 text-center"}>Sign In</h1>
                    <Form className={'d-flex flex-column'}>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type={"email"}
                                          onChange={(e) => {
                                              setError(null)
                                              setEmail(e.target.value)
                                          }}
                                          placeholder={'example@domain.com'}
                                          required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type={"password"}
                                          onChange={(e) => {
                                              setError(null)
                                              setPassword(e.target.value)
                                          }}
                                          required/>
                        </Form.Group>
                        <NavLink href={'/reset-password'} className={'p-0 float-end'} style={{color: 'grey', fontSize: '0.9rem'}}>
                            Forgot Password?
                        </NavLink>
                        {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                        <div className={'d-flex justify-content-center'}>
                            {loading && <Spinner animation={'border'}/>}
                        </div>
                        <div className={'d-flex mt-5'}>
                            <NavLink className={'me-auto pe-0 ps-0'} href={"/sign-up"}>Register Here</NavLink>
                            <Button className={"d-flex align-self-md-center"} type={"submit"} onClick={handleClick}>Submit</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <NavLink href={'/'}>Back to Home Page</NavLink>
        </Container>
    )
}