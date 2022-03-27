import { Card, Modal, Form, Button } from 'react-bootstrap'
import { useCallback, useState } from "react";
import FileTab from "./FileTab";
import requests from "../helpers/requests";
import { useLocation } from "react-router-dom";


function getCourseID(location) {
    const path = location.pathname
    const arr = path.split('/')
    return arr[arr.length - 1]
}

async function createSubject(code, name, text, files) {
    const body = { code, name, text, files }
    const formData = new FormData()
    formData.append('code', code)
    formData.append('name', name)
    formData.append('text', text)
    formData.append('files', files[0])
    const res = await requests.customPost('/course/create/subject', formData)
    return res.status
}



export default function AddSubject(props) {
    const [files, setFiles] = useState([])
    const [name, setName] = useState('')
    const [text, setText] = useState('')
    const location = useLocation()

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
        createSubject(getCourseID(location), name, text, files)
    }


    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add a New Subject
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Enter Subject Name:
                        </Form.Label>
                        <Form.Control onChange={e => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>
                            Enter Some Free Text:
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