import React, { useState } from 'react';
import { Container, Card, Button, Form, NavLink } from 'react-bootstrap';
import { useAuth } from "../../components/AuthContext";

export default function SignIn(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()

    const handleClick = async (e) => {
        e.preventDefault()
        await login(email, password)
    }

    return (
        <Container className={"w-100 vh-100 d-flex justify-content-center align-items-center"}>
            <Card className={"w-100"} style={{ maxWidth: 400 }}>
                <Card.Body className={"p-5"}>
                    <h1 className={"mb-3 text-center"}>Sign In</h1>
                    <Form>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type={"email"}
                                          onChange={(e) => setEmail(e.target.value)}
                                          placeholder={'example@domain.com'}
                                          required/>
                        </Form.Group>
                        <Form.Group className={"mb-3"}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type={"password"}
                                          onChange={(e) => setPassword(e.target.value)}
                                          required/>
                        </Form.Group>
                        <div key={'box'}>
                            <Form.Check id={"box"} className={"mb-3"} type={"checkbox"} label={"Remember Me"}/>
                        </div>
                        <div className={'d-flex'}>
                            <Button className={"d-flex align-self-md-center"} type={"submit"} onClick={handleClick}>Submit</Button>
                            <NavLink className={'ms-auto pe-0'} href={"/sign-up"}>Register Here</NavLink>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}