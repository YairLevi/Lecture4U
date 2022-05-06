import React, { useState } from 'react';
import { Button, Card, Container, Form, NavLink } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";


export default function SignIn(props) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { register } = useAuth()

    return (
        <Container className={"w-100 vh-100 d-flex justify-content-center align-items-center"}>
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
                    </Form>
                    <div className={'d-flex'}>
                        <Button className={"d-flex align-self-md-center"} type={"submit"}
                                onClick={async (e) => {
                                    e.preventDefault()
                                    await register({ firstName, lastName, email, password })
                                }}>Register</Button>
                        <NavLink className={'ms-auto pe-0'} href={"/sign-in"}>Got An Account?</NavLink>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}