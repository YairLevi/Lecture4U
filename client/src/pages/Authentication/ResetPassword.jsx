import React, { useState } from 'react';
import { Button, Card, Container, Form, NavLink, Spinner } from 'react-bootstrap';
import { useLoading } from "../../hooks/useLoading";
import { ERRORS } from "../../helpers/errors";
import { useNav } from "../../contexts/NavContext";
import { useSearchParams } from "react-router-dom";
import requests from "../../helpers/requests";

export default function ResetPassword(props) {
    const [error, setError] = useState()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { fullNav } = useNav()
    const [searchParams] = useSearchParams()
    const email = searchParams.get('email')

    const [loading, action] = useLoading(async () => {
        setError(null)
        if (password !== confirmPassword) return setError(ERRORS.DONT_MATCH)
        if (password === '') return setError(ERRORS.EMPTY_NAME)
        const result = await requests.post('/reset-password', { password, email })
        if (result.status !== 200) return setError(ERRORS.GENERAL_ERROR)
        return true
    })

    async function handleClick(e) {
        e.preventDefault()
        const res = await action()
        if (res) fullNav('/sign-in', {}, false)
    }

    return (
        <Container className={"w-100 vh-100 d-flex justify-content-center align-items-center flex-column"}>
            <Card className={"w-100"} style={{ maxWidth: 400 }}>
                <Card.Body className={"p-5"}>
                    <h1 className={"mb-3 text-center"}>Reset Password</h1>
                    <Form>
                        <Form.Group>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type={"password"}
                                          onChange={(e) => {
                                              setError(null)
                                              setPassword(e.target.value)
                                          }}
                                          required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type={"password"}
                                          onChange={(e) => {
                                              setError(null)
                                              setConfirmPassword(e.target.value)
                                          }}
                                          required/>
                        </Form.Group>
                        {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                        <div className={'d-flex justify-content-center'}>
                            {loading && <Spinner animation={'border'}/>}
                        </div>                        <div className={'d-flex mt-3'}>
                        <NavLink className={'me-auto pe-0'} href={"/sign-in"}>Cancel</NavLink>
                        <Button className={"d-flex align-self-md-center"}
                                type={"submit"}
                                disabled={loading}
                                onClick={handleClick}>Reset</Button>
                    </div>
                    </Form>
                </Card.Body>
            </Card>

            <NavLink href={'/'}>Back to Home Page</NavLink>
        </Container>
    )
}