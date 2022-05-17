import { Button, Card, Container, Form, InputGroup, Modal, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import requests from "../../../helpers/requests";
import { useParams } from "react-router";
import { useLoading } from "../../../hooks/useLoading";
import { ERRORS } from "../../../helpers/errors";
import { useRefresh } from "../../../hooks/useRefresh";
import FileTab from "../../../components/FileTab";


export default function AddMember(props) {
    const [email, setEmail] = useState('')
    const [list, setList] = useState([])
    const [error, setError] = useState()
    const refresh = useRefresh()
    const { id } = useParams()

    const [loading, action] = useLoading(async () => {
        const res = await requests.post('/groups/add-members', {
            emails: list, groupId: id
        })
        return res.status === 200
    })

    async function addMembers() {
        setError(null)
        if (list.length === 0) return setError(ERRORS.EMPTY_NAME)
        const result = await action()
        if (!result) return setError(ERRORS.GENERAL_ERROR)
        refresh()
    }

    function addToList() {
        const regexEmailAddress = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{1,4}$"
        if (email === '' || !email.match(regexEmailAddress)) {
            return setError(ERRORS.INVALID_INPUT)
        }
        setList(prev => [...prev, email])
        setEmail('')
        setError(null)
    }

    function removeFromListAtIndex(index) {
        setList(prev => {
            const newList = [...prev]
            newList.splice(index, 1)
            return newList
        })
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Add Members</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>
                        User Mail Address
                    </Form.Label>
                    <InputGroup>
                        <Form.Control type={"mail"} value={email} onChange={e => setEmail(e.target.value)}/>
                        <Button onClick={addToList}>Add</Button>
                    </InputGroup>
                    <Card className={'mt-3 pb-0'}>
                        <Card.Body className={'overflow-auto'} style={{ maxHeight: '20rem' }}>
                            {
                                list && list.map((value, index) => {
                                    return <FileTab key={index}
                                                    name={value}
                                                    onClick={() => removeFromListAtIndex(index)}/>
                                })
                            }
                        </Card.Body>
                    </Card>

                </Form>
            </Modal.Body>
            <Modal.Footer className={'d-flex'}>
                {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                {loading && <Spinner animation={"border"}/>}
                <Button disabled={loading} onClick={addMembers}>Apply Changes</Button>
            </Modal.Footer>
        </Modal>
    )
}