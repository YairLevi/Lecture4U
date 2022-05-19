import React, { useState } from 'react'
import { Modal, Button, Form, Spinner } from 'react-bootstrap'
import { useLoading } from "../../../hooks/useLoading";
import requests from "../../../helpers/requests";
import { ERRORS } from "../../../helpers/errors";
import { useRefresh } from "../../../hooks/useRefresh";
import { useAuth } from "../../../contexts/AuthContext";


export default function NewCourse(props) {
    const [error, setError] = useState(null)
    const [name, setName] = useState(null)
    const [description, setDescription] = useState(null)
    const refresh = useRefresh()
    const { currentUser } = useAuth()
    const teacher = `${currentUser.firstName} ${currentUser.lastName}`
    const [loading, createCourse] = useLoading(async () => {
        setError(null)
        const res = await requests.post('/course/create', { name, teacher, description })
        if (res.status !== 200)
            return setError(ERRORS.GENERAL_ERROR)
        refresh()
    })

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Create A New Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className={'d-flex flex-column justify-content-center'}>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Course Name:</Form.Label>
                        <Form.Control
                            onChange={(e) => setName(e.target.value)}
                            placeholder={'Course Name'}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={'What is this course about?'}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className={'d-flex'}>
                {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                {loading && <Spinner animation={"border"}/>}
                <Button onClick={createCourse} disabled={loading}>Create Course</Button>
            </Modal.Footer>
        </Modal>
    )
}