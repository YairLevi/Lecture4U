import React, { useState } from 'react'
import { Modal, Button, Form, Spinner } from 'react-bootstrap'


async function createCourse(name, teacher, description) {
    const options = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ name, teacher, description })
    }
    const result = await fetch('http://localhost:8000/course/create', options)
    return result.status === 200
}

export default function NewCourseModal(props) {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(null)
    const [staff, setStaff] = useState(null)
    const [description, setDescription] = useState(null)

    async function handleClick() {
        setLoading(true)
        setError(null)
        const success = await createCourse(name, staff, description)
        if (!success) setError('An error occurred, try again')
        setLoading(false)
    }

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
                        <Form.Label>Course Instructor:</Form.Label>
                        <Form.Control
                            onChange={(e) => setStaff(e.target.value)}
                            placeholder={'Dr. John Doe'}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={'What is this course about?'}/>
                    </Form.Group>
                    <Button variant={'primary'} disabled={loading} className={'mb-3'} onClick={handleClick}>
                        Create Course
                    </Button>
                    { loading && <Spinner className={'m-3 align-self-center'} animation="border"/> }
                    { error && <span className={'alert-danger p-2'}>{error}</span>}
                </Form>
            </Modal.Body>
        </Modal>
    )
}