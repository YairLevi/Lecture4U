import { Button, Form, Modal, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import requests from "../helpers/requests";
import { useLoading } from "../hooks/useLoading";
import { useRefresh } from "../hooks/useRefresh";


export default function AddPhoto(props) {
    const [image, setImage] = useState()
    const [error, setError] = useState()
    const refresh = useRefresh()

    const [loading, uploadImage] = useLoading(async () => {
        const formData = new FormData()
        formData.append('files', image)
        const res = await requests.postMultipart('/profile/image', formData)
        return res.status === 200
    })

    async function handleClick() {
        setError(null)
        if (!image) return setError('Select an image')
        const result = await uploadImage()
        if (result) return setError('Something went wrong. Please try again later')
        refresh()
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Add Photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className={'mb-3'}>
                    <Form.Label>Image File</Form.Label>
                    <Form.Control type={'file'}
                                  accept={'.png, .jpg, .jpeg, .svg'}
                                  onChange={e => setImage(e.target.files[0])}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className={'d-flex'}>
                {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                {loading && <Spinner animation={"border"}/>}
                <Button onClick={handleClick} disabled={loading}>
                    Apply Change
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
