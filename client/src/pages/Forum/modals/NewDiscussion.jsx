import { Form, Modal, Button, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import requests from "../../../helpers/requests";
import { useLoading } from "../../../hooks/useLoading";
import { useParams } from "react-router"
import { ERRORS } from "../../../helpers/errors";
import { useRefresh } from "../../../hooks/useRefresh";


export default function NewDiscussion(props) {
    const [title, setTitle] = useState()
    const [question, setQuestion] = useState()
    const { centered, show, onHide, addDiscussion } = {...props}
    const [error, setError] = useState('')
    const { id: courseId }= useParams()
    const refresh = useRefresh()
    const [loading, handleClick] = useLoading(async () => {
        setError(null)
        const res = await requests.post('/forum/create/discussion', { courseId, title, question })
        if (res.status !== 200) return setError(ERRORS.GENERAL_ERROR)
        refresh()
    })

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>
                    Create a New Discussion
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Subject
                        </Form.Label>
                        <Form.Control onChange={e => setTitle(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Your question
                        </Form.Label>
                        <Form.Control as={'textarea'} rows={4} onChange={e => setQuestion(e.target.value)}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className={'d-flex'}>
                {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                {loading && <Spinner animation={"border"}/>}
                <Button onClick={handleClick} disabled={loading}>Apply Changes</Button>
            </Modal.Footer>
        </Modal>
    )
}