import { useParams } from "react-router-dom";
import requests from "../helpers/requests";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { useState } from "react";


export default function EditText(props) {
    const [description, setDescription] = useState(props.content)
    const { id } = useParams()

    async function changeDescription() {
        const res = await requests.post('/groups/description', { groupId: id, description })
        console.log(description)
        return res.status
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
                        <Form.Control as={'textarea'} value={description} rows={5} onChange={e => setDescription(e.target.value)}/>
                    </Form.Group>
                    <Button variant={'primary'} onClick={changeDescription}>Apply Changes</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}