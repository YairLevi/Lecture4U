import React, { useState } from 'react'
import { FormControl, Modal, Button, InputGroup } from 'react-bootstrap'
import { Spinner } from "react-bootstrap";
import { ERRORS } from '../../../helpers/errors'
import { useLoading } from "../../../hooks/useLoading";
import requests from "../../../helpers/requests";
import { useRefresh } from "../../../hooks/useRefresh";


export default function AddCourse(props) {
    const [courseId, setCourseId] = useState(null)
    const [error, setError] = useState(null)
    const refresh = useRefresh()
    const [loading, addCourse] = useLoading(async () => {
        const res = await requests.post('/course/enroll', { courseId })
        return res.status
    })

    async function handleClick() {
        setError(null)
        const result = await addCourse()
        if (result === 403)
            return setError(ERRORS.TEACHER_SELF_ENROLL_ERROR)
        else if (result !== 200)
            return setError(ERRORS.WRONG_CODE)
        refresh()
    }

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Enter Course Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    To add a course, you are required to have that course's ID.
                </p>
                <InputGroup className={'mb-3'}>
                    <FormControl
                        placeholder={'Enter course code'}
                        onChange={e => setCourseId(e.target.value)}
                    />
                </InputGroup>
            </Modal.Body>
            <Modal.Footer className={'d-flex'}>
                {error && <p className={'alert-danger p-2 w-100 rounded-2'}>{error}</p>}
                {loading && <Spinner animation={"border"}/>}
                <Button onClick={handleClick} disabled={loading}>Enroll</Button>
            </Modal.Footer>
        </Modal>
    )
}