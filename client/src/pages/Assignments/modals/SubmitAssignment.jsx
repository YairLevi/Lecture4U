import { Card, Modal, Form, Button } from 'react-bootstrap'
import { useCallback, useState } from "react";
import FileTab from "../../../components/FileTab";
import requests from "../../../helpers/requests";
import { useLocation } from "react-router-dom";
import { useParams } from 'react-router-dom'


async function createSubmission(courseId, assignmentId, text, files) {
    const formData = new FormData()
    formData.append('courseId', courseId)
    formData.append('assignmentId', assignmentId)
    formData.append('text', text)
    for (const file of files) {
        formData.append('files', file)
    }
    const res = await requests.postMultipart('/course/create/submit', formData)
    return res.status
}


export default function SubmitAssignment(props) {
    const [files, setFiles] = useState([])
    const [name, setName] = useState('')
    const [text, setText] = useState('')
    const [date, setDate] = useState(null)
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

    function makeChanges() {
        createSubmission(id, props.assignmentId, text, files)
    }


    return (
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add a New Subject
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Comments:
                        </Form.Label>
                        <Form.Control as={'textarea'} rows={4} onChange={e => setText(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Files / Attachments:
                        </Form.Label>
                        <Form.Control type={'file'} multiple onChange={e => addFiles(e)}/>
                    </Form.Group>
                    <Card className={'mb-3 pb-0'}>
                        <Card.Body className={'overflow-auto'} style={{ maxHeight: '20rem' }}>
                            {files && displayFiles(files)}
                        </Card.Body>
                    </Card>
                    <Button variant={'primary'} onClick={makeChanges}>Make Changes</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}