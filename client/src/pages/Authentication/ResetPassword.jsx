import React, { useState } from 'react';
import { Button, Card, Container, Form, NavLink, Spinner } from 'react-bootstrap';
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../hooks/useLoading";
import { ERRORS } from "../../helpers/errors";
import { useNav } from "../../contexts/NavContext";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword(props) {
    const { checkIfExists } = useAuth()
    const [error, setError] = useState()
    const [code, setCode] = useState()
    const { relativeNav } = useNav()
    const [searchParams] = useSearchParams()
    const email = searchParams.get('email')
    const [loading, action] = useLoading(async () => {
        return await checkIfExists(email)
    })

    async function handleClick(e) {
        e.preventDefault()
        setError(null)
        const doesExist = await action(email)
        if (!doesExist) return setError(ERRORS.EMAIL_DONT_EXIST)
        relativeNav('/code')
    }

    return (
        <Container className={"w-100 vh-100 d-flex justify-content-center align-items-center flex-column"}>
            <Card className={"w-100"} style={{ maxWidth: 400 }}>
                <Card.Body className={"p-5"}>
                    <h1 className={"mb-3 text-center"}>Reset Password</h1>
                    <Form>
                        <Form.Group className={"mb-3"}>
                            <Form.Label className={'mb-3'}>
                                We sent a security code to the address:<br/>
                                {email}<br/>
                                Check your inbox and insert it here.
                            </Form.Label>
                            <Form.Control placeholder={'XXXXXXXX'} onChange={(e) => setCode(e.target.value)} required/>
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