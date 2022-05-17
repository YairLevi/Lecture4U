import { Card, Modal, Form, Button, Spinner } from 'react-bootstrap'
import React, { useCallback, useState } from "react";
import FileTab from "../../../components/FileTab";
import requests from "../../../helpers/requests";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router";
import { ERRORS } from "../../../helpers/errors";
import { useRefresh } from "../../../hooks/useRefresh";
import { useLoading } from "../../../hooks/useLoading";


export default function AddSubject({ show, onHide, unitId}) {
    const [files, setFiles] = useState([])
    const [name, setName] = useState('')
    const [text, setText] = useState('')
    const { id: courseId } = useParams()

    const refresh = useRefresh()
    const [error, setError] = useState('')
    const [loading, handleClick] = useLoading(async () => {
        setError(null)
        const formData = new FormData()
        formData.append('courseId', courseId)
        formData.append('unitId', unitId)
        formData.append('name', name)
        formData.append('text', text)
        for (const file of files) {
            formData.append('files', file)
        }
        const res = await requests.postMultipart('/course/create/subject', formData)
        if (res.status !== 200) return setError(ERRORS.GENERAL_ERROR)
        refresh()
    })

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


    return (
        <Modal {...{ onHide, show}}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add a New Subject
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Subject Name
                        </Form.Label>
                        <Form.Control onChange={e => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Description
                        </Form.Label>
                        <Form.Control as={'textarea'} rows={4} onChange={e => setText(e.target.value)}/>
                    </Form.Group>
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