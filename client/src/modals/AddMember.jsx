import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import requests from "../helpers/requests";
import { useParams } from "react-router";


export default function AddMember(props) {
    const [email, setEmail] = useState()
    const { id } = useParams()

    async function addMember() {
        const res = await requests.post('/groups/add-member', { email, groupId: id })
        return res.status !== 200
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Enter User Mail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>
                        User Mail Address
                    </Form.Label>
                    <Form.Control type={"mail"} onChange={e => setEmail(e.target.value)}/>
                </Form>
                {/*{loading && <Spinner className={'m-3 align-self-center'} animation="border"/>}*/}
                {/*{error && <span className={'alert-danger p-2'}>{error}</span>}*/}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={addMember}>Add</Button>
            </Modal.Footer>
        </Modal>
    )
}