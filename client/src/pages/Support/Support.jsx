import requests from "../../helpers/requests";
import { Spinner, Container, Form, Button } from "react-bootstrap";
import { useState } from 'react'
import { useLoading } from "../../hooks/useLoading";


export default function Support() {
    const [subject, setSubject] = useState('')
    const [content, setContent] = useState('')

    const [loading, action] = useLoading(async () => {
        const res = await requests.post('/mail/support', { subject, content })
        if (res.status === 200) {
            setSubject('')
            setContent('')
        }
    })

    return (
        <Container>
            <h1>Ask for help</h1>
            <h4>Our support team is here for you!</h4>
            <br/>
            <p>Report a bug, or ask for assistance with the platform in general</p>
            <Form>
                <Form.Label className={'mt-4'}>Subject of request</Form.Label>
                <Form.Control value={subject} onChange={e => setSubject(e.target.value)}/>
                <Form.Label className={'mt-4'}>Additional content</Form.Label>
                <Form.Control value={subject} onChange={e => setSubject(e.target.value)} as={'textarea'} rows={5}/>
            </Form>
            <div className={'d-flex align-items-center mt-3'}>
                <Button className={'me-3'} onClick={action}>Send Message</Button>
                {
                    loading && <Spinner animation={'border'}/>
                }
            </div>
        </Container>
    )
}