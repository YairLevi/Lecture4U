import React, { useState } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useAuth } from "../../components/AuthContext";

export default function SignIn(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()

    return (
        <Container className={"w-100 vh-100 d-flex justify-content-center align-items-center"}>
            <Card className={"w-100"} style={{ maxWidth: 400 }}>
                <Card.Body className={"p-5"}>
                    <h1 className={"mb-3 text-center"}>Sign In</h1>
                    <Form>
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
                        <Form.Check className={"mb-3"} type={"checkbox"} label={"Remember Me"}/>
                        <Button className={"d-flex align-self-md-center"} type={"submit"}
                                onClick={async (e) => {
                                    e.preventDefault()
                                    await login(email, password)
                                }}>Submit</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}