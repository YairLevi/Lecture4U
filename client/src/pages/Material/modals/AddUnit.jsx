import { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import requests from "../../../helpers/requests";
import { useLocation } from "react-router";


function getCourseID(location) {
    const path = location.pathname
    const arr = path.split('/')
    return arr[arr.length - 1]
}

async function createUnit(courseId, unitName, unitText) {
    const body = {
        code: courseId,
        name: unitName,
        text: unitText,
    }
    const response = await requests.post('/course/create/unit', body)
    return response.status
}


export default function AddUnit(props) {
    const [name, setName] = useState(null)
    const [text, setText] = useState(null)
    const [error, setError] = useState(null)
    const location = useLocation()

    async function handleClick() {
        setError(null)
        const courseId = getCourseID(location)
        const status = await createUnit(courseId, name, text)
        if (status !== 200) setError('Error in unit creation. try again')
    }

    return (
        <Modal {...props} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add Unit
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className={'d-flex flex-column justify-content-center'}>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Enter new unit's name:</Form.Label>
                        <Form.Control onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Enter something about this unit:</Form.Label>
                        <Form.Control onChange={(e) => setText(e.target.value)} as={'textarea'} rows={5}/>
                    </Form.Group>
                    <Button onClick={handleClick}>Add New Unit</Button>
                    { error && <span className={'alert-danger'}>{error}</span> }
                </Form>
            </Modal.Body>
        </Modal>
    )
}