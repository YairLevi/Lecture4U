import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { useLoading } from "../../hooks/useLoading";
import requests from "../../helpers/requests";
import image from '../../assets/img_1.png'


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
            <Row className={"justify-content-center align-items-center"}>
                <Col className={"text-center text-md-start"}>
                    <h1 style={{ fontWeight: 'bold' }}>
                        Contact Us
                    </h1>
                    <h3>
                        Tell us and let us know how you feel about our platform!
                    </h3>
                </Col>
                <Col className={"text-center col-md-6 col-12 d-md-block"}>
                    <img className={"img-fluid"} src={`${image}`} alt={"pic"}/>
                </Col>
            </Row>
            <h2>Write a message</h2>
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