import { useParams } from "react-router-dom";
import requests from "../../../helpers/requests";
import { Button, Card, Form, Modal, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { useLoading } from "../../../hooks/useLoading";
import { ERRORS } from "../../../helpers/errors";
import { useRefresh } from "../../../hooks/useRefresh";


export default function EditText(props) {
    const [description, setDescription] = useState(props.content)
    const [error, setError] = useState()
    const refresh = useRefresh()
    const { id } = useParams()

    const [loading, action] = useLoading(async () => {
        const res = await requests.post('/groups/description', { groupId: id, description })
        return res.status === 200
    })

    async function handleClick() {
        const result = await action()
        if (!result) return setError(ERRORS.GENERAL_ERROR)
        refresh()
    }

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Description
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Type here:
                        </Form.Label>
                        <Form.Control as={'textarea'} value={description} rows={5}
                                      onChange={e => setDescription(e.target.value)}/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className={'d-flex'}>
                {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                {loading && <Spinner animation={"border"}/>}
                <Button disabled={loading} onClick={handleClick}>Apply Changes</Button>
            </Modal.Footer>
        </Modal>
    )
}