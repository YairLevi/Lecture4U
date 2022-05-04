import { Card, Modal, Form, Button } from 'react-bootstrap'
import { useCallback, useState } from "react";
import FileTab from "./FileTab";
import requests from "../helpers/requests";
import { useParams } from 'react-router-dom'


export default function UploadFiles(props) {
    const [files, setFiles] = useState([])
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

    async function uploadFiles() {
        const formData = new FormData()
        formData.append('groupId', id)
        for (const file of files) {
            formData.append('files', file)
        }
        const res = await requests.postMultipart('/groups/upload', formData)
        return res.status
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
                            Files / Attachments:
                        </Form.Label>
                        <Form.Control type={'file'} multiple onChange={e => addFiles(e)}/>
                    </Form.Group>
                    <Card className={'mb-3 pb-0'}>
                        <Card.Body className={'overflow-auto'} style={{ maxHeight: '20rem' }}>
                            {files && displayFiles(files)}
                        </Card.Body>
                    </Card>
                    <Button variant={'primary'} onClick={uploadFiles}>Upload Files</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}