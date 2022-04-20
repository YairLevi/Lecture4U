import { Form, Modal, Button } from "react-bootstrap";
import { useState } from "react";
import requests from "../helpers/requests";
import { useCourse } from "../components/CourseContext";


async function addDiscussion(title, question, courseId) {
    const res = await requests.post('/forum/create/discussion',
        { title, question },
        { courseId })
    return res.status
}


export default function NewDiscussion(props) {
    const [title, setTitle] = useState()
    const [question, setQuestion] = useState()
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState('')
    const { course } = useCourse()

    async function onPostClick() {
        setLoading(true)
        const status = await addDiscussion(title, question, course)
        // do something with status
        setLoading(false)
    }

    return (
        <Modal {...props}>
            <Modal.Header>
                <Modal.Title>
                    Create a New Discussion
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Subject:
                        </Form.Label>
                        <Form.Control onChange={e => setTitle(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Enter your question:
                        </Form.Label>
                        <Form.Control as={'textarea'} rows={4} onChange={e => setQuestion(e.target.value)}/>
                    </Form.Group>
                </Form>
                <Button onClick={onPostClick}>Post</Button>
            </Modal.Body>
        </Modal>
    )
}