import React, { useState } from 'react'
import { Button, Modal, Form, Spinner } from 'react-bootstrap'
import { useLoading } from "../../../hooks/useLoading";
import requests from "../../../helpers/requests";
import { ERRORS } from "../../../helpers/errors";
import { useParams } from 'react-router-dom'
import { useRefresh } from "../../../hooks/useRefresh";


export default function NewDocumentModal(props) {
    const [name, setName] = useState('')
    const [error, setError] = useState()
    const refresh = useRefresh()
    const { id: groupId } = useParams()

    const [loading, action] = useLoading(async () => {
        const res = await requests.post('/groups/create-document', { groupId, name })
        return res.status === 200
    })

    async function handleClick() {
        setError(null)
        const result = await action()
        if (!result) return setError(ERRORS.GENERAL_ERROR)
        refresh()
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add Document
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control onChange={e => setName(e.target.value)}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                {loading && <Spinner animation={"border"}/>}
                <Button onClick={handleClick} disabled={loading}>Apply Changes</Button>
            </Modal.Footer>
        </Modal>
    )
}