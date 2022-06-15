import { Button, Modal, Spinner } from 'react-bootstrap'
import { useLoading } from "../hooks/useLoading";
import React, { useState } from "react";
import { ERRORS } from "../helpers/errors";
import { useRefresh } from "../hooks/useRefresh";


export default function ConfirmationModal({ show, onHide, func, text}) {
    const [error, setError] = useState()
    const refresh = useRefresh()
    const [loading, action] = useLoading(async () => func())

    async function handleClick(e) {
        e.stopPropagation()
        setError(null)
        const result = await action()
        if (!result) return setError(ERRORS.GENERAL_ERROR)
        refresh()
    }

    function handleClose(e) {
        e.stopPropagation()
        onHide()
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>Are You Sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>You are about to <strong>{text}</strong>.<br/>Are you sure?</p>
            </Modal.Body>
            <Modal.Footer className={'d-flex'}>
                {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                {loading && <Spinner animation={"border"}/>}
                <Button variant={"outline"} onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClick} disabled={loading}>Continue</Button>
            </Modal.Footer>
        </Modal>
    )
}