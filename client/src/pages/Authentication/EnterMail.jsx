import React, { useState } from 'react';
import { Button, Card, Container, Form, NavLink, Spinner } from 'react-bootstrap';
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../hooks/useLoading";
import { ERRORS } from "../../helpers/errors";
import { useNav } from "../../contexts/NavContext";

export default function EnterMail(props) {
    const [email, setEmail] = useState('')
    const { checkIfExists, generateCode } = useAuth()
    const [error, setError] = useState()
    const { relativeNav } = useNav()

    const [loading, action] = useLoading(async () => {
        setError(null)
        const doesExist = await checkIfExists(email)
        if (!doesExist) return setError(ERRORS.EMAIL_DONT_EXIST)
        const result = await generateCode(email)
        if (!result) return setError(ERRORS.GENERAL_ERROR)
        return true
    })

    async function handleClick(e) {
        e.preventDefault()
        const res = await action()
        if (res) relativeNav('/code', { email })
    }

    return (
        <Container className={"w-100 vh-100 d-flex justify-content-center align-items-center flex-column"}>
            <Card className={"w-100"} style={{ maxWidth: 400 }}>
                <Card.Body className={"p-5"}>
                    <h1 className={"mb-3 text-center"}>Enter Email</h1>
                    <Form>
                        <Form.Group className={"mb-3"}>
                            <Form.Label className={'mb-3'}>
                                Type in the email address associated with the account you wish to reset
                            </Form.Label>
                            <Form.Control type={"email"}
                                          onChange={(e) => setEmail(e.target.value)}
                                          placeholder={'example@domain.com'}
                                          required/>
                        </Form.Group>
                        {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                        <div className={'d-flex justify-content-center'}>
                            {loading && <Spinner animation={'border'}/>}
                        </div>
                        <div className={'d-flex mt-3'}>
                            <NavLink className={'me-auto pe-0'} href={"/sign-in"}>Cancel</NavLink>
                            <Button className={"d-flex align-self-md-center"}
                                    type={"submit"}
                                    disabled={loading}
                                    onClick={handleClick}>Get Code</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            <NavLink href={'/'}>Back to Home Page</NavLink>
        </Container>
    )
}