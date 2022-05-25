import { Card, Modal, Form, Button, Spinner } from 'react-bootstrap'
import React, { useCallback, useState } from "react";
import FileTab from "../../../components/FileTab";
import requests from "../../../helpers/requests";
import { useLocation } from "react-router-dom";
import { useParams } from 'react-router-dom'
import { useRefresh } from "../../../hooks/useRefresh";
import { useLoading } from "../../../hooks/useLoading";
import { ERRORS } from "../../../helpers/errors";

export default function EditSubmission(props) {
    const [files, setFiles] = useState([])
    const [currentFiles, setCurrentFiles] = useState(props.files)
    const [text, setText] = useState(props.text)
    const { id: courseId } = useParams()

    const [error, setError] = useState('')
    const refresh = useRefresh()
    const [loading, handleClick] = useLoading(async () => {
        setError(null)
        const formData = new FormData()
        formData.append('courseId', courseId)
        formData.append('assignmentId', props.assignmentId)
        formData.append('submissionId', props._id)
        formData.append('text', text)
        formData.append('currentFiles', JSON.stringify(currentFiles))
        for (const file of files) {
            formData.append('files', file)
        }
        const res = await requests.postMultipart('/course/update/submission', formData)
        if (res.status !== 200) return setError(ERRORS.GENERAL_ERROR)
        refresh()
    })

    function addFiles(e) {
        for (const file of e.target.files) {
            setFiles(prevState => [...prevState, file])
        }
    }

    function removeCurrentFile(name) {
        setCurrentFiles(prevState => prevState.filter(file => file.name !== name))
    }

    function removeNewFile(name) {
        setFiles(prevState => prevState.filter(file => file.name !== name))
    }

    function displayFiles(files, isNew) {
        return files.map((value, index) => {
            return <FileTab key={index}
                            name={value.name}
                            onClick={() => isNew ? removeNewFile(value.name) : removeCurrentFile(value.name)}
            />
        })
    }

    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Your Submission
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Comments
                        </Form.Label>
                        <Form.Control value={text} as={'textarea'} rows={4} onChange={e => setText(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Delete Present Files
                        </Form.Label>
                        <Card>
                            <Card.Body className={'overflow-auto'} style={{ maxHeight: '20rem' }}>
                                {currentFiles && displayFiles(currentFiles, false)}
                            </Card.Body>
                        </Card>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Files / Attachments
                        </Form.Label>
                        <Form.Control type={'file'} multiple onChange={e => addFiles(e)}/>
                        <Card className={'mt-3 pb-0'}>
                            <Card.Body className={'overflow-auto'} style={{ maxHeight: '20rem' }}>
                                {files && displayFiles(files, true)}
                            </Card.Body>
                        </Card>
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