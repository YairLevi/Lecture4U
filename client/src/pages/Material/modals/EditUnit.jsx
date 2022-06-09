import React, { useState } from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import requests from "../../../helpers/requests";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom";
import { useLoading } from "../../../hooks/useLoading";
import { ERRORS } from "../../../helpers/errors";
import { useRefresh } from "../../../hooks/useRefresh";


export default function EditUnit(props) {
    const [name, setName] = useState(props.name)
    const [text, setText] = useState(props.text)
    const unitId = props.id
    const [error, setError] = useState(null)
    const { id: courseId } = useParams()
    const refresh = useRefresh()
    const [loading, handleClick] = useLoading(async () => {
        setError(null)
        const res = await requests.post('/course/update/unit', { courseId, unitId, name, text })
        if (res.status !== 200) return setError(ERRORS.GENERAL_ERROR)
        refresh()
    })

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Unit
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className={'d-flex flex-column justify-content-center'}>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Unit Name</Form.Label>
                        <Form.Control value={name} onChange={e => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control value={text} onChange={e => setText(e.target.value)} as={'textarea'} rows={5}/>
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