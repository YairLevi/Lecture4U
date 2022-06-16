import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useState } from "react";
import { useLoading } from "../../hooks/useLoading";
import requests from "../../helpers/requests";


export default function Contact() {
    const [subject, setSubject] = useState('')
    const [content, setContent] = useState('')

    const [loading, action] = useLoading(async () => {
        const res = await requests.post('/mail/contact', { subject, content })
        if (res.status === 200) {
            setContent('')
            setSubject('')
        }
    })

    return (
        <Container className={'p-4'}>
            <h1>Contact</h1>
            <h3>Send us a message and let us know how you feel about our platform!</h3>
            <Form className={'mt-5'}>
                <Form.Label>What is this message about?</Form.Label>
                <Form.Control value={subject} onChange={e => setSubject(e.target.value)}/>
                <Form.Label className={'mt-3'}>Please elaborate</Form.Label>
                <Form.Control as={"textarea"} rows={10} value={content} onChange={e => setContent(e.target.value)}/>
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