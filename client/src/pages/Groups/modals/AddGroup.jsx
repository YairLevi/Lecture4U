import React, { useState } from 'react'
import { Form, Modal, Button } from 'react-bootstrap'
import { Spinner } from "react-bootstrap";
import requests from "../../../helpers/requests";
import { useLoading } from "../../../hooks/useLoading";
import { ERRORS } from "../../../helpers/errors";
import { useRefresh } from "../../../hooks/useRefresh";


export default function AddGroup(props) {
    const [error, setError] = useState(null)
    const [name, setName] = useState('')
    const refresh = useRefresh()

    const [loading, addGroup] = useLoading(async () => {
        const res = await requests.post('/groups/create-group', { name })
        return res.status === 200
    })

    async function handleClick() {
        setError(null)
        if (name === '') return setError(ERRORS.EMPTY_NAME)
        const result = await addGroup()
        if (!result) return setError(ERRORS.GENERAL_ERROR)
        refresh()
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Add Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control
                            type={'text'}
                            onChange={e => setName(e.target.value)}
                        />
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