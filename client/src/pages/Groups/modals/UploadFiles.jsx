import { Card, Modal, Form, Button, Spinner } from 'react-bootstrap'
import React, { useCallback, useState } from "react";
import FileTab from "../../../components/FileTab";
import requests from "../../../helpers/requests";
import { useParams } from 'react-router-dom'
import { useRefresh } from "../../../hooks/useRefresh";
import { useLoading } from "../../../hooks/useLoading";
import { ERRORS } from "../../../helpers/errors";


export default function UploadFiles(props) {
    const [files, setFiles] = useState([])
    const [error, setError] = useState()
    const refresh = useRefresh()
    const { id } = useParams()

    function addFiles(e) {
        for (const file of e.target.files) {
            setFiles(prevState => [...prevState, file])
        }
    }

    function removeFile(name) {
        setFiles(prevState => prevState.filter(file => file.name !== name))
    }

    function displayFiles(files) {
        return files.map((value, index) => {
            return <FileTab key={index} name={value.name} onClick={() => removeFile(value.name)}/>
        })
    }

    const [loading, action] = useLoading(async () => {
        const formData = new FormData()
        formData.append('groupId', id)
        for (const file of files) {
            formData.append('files', file)
        }
        const res = await requests.postMultipart('/groups/upload', formData)
        return res.status === 200
    })

    async function handleClick() {
        setError(null)
        const result = await action()
        if (!result) return setError(ERRORS.GENERAL_ERROR)
        refresh()
    }


    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Upload Files
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Files / Attachments
                        </Form.Label>
                        <Form.Control type={'file'} multiple onChange={e => addFiles(e)}/>
                    </Form.Group>
                    <Card className={'mb-3 pb-0'}>
                        <Card.Body className={'overflow-auto'} style={{ maxHeight: '20rem' }}>
                            {files && displayFiles(files)}
                        </Card.Body>
                    </Card>
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