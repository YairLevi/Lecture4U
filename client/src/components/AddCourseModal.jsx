import React, { useState } from 'react'
import { FormControl, Modal, Button, InputGroup } from 'react-bootstrap'


export default function AddCourseModal(props) {
    const [disabled, setDisabled] = useState(true)

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Enter Course Code</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>To add a course, you are required to have that course's ID.
                    This mechanism prevents users from entering private courses freely.</p>
                <InputGroup>
                    <FormControl placeholder={'Enter course code'}/>
                    <Button disabled={disabled}>Add Course</Button>
                </InputGroup>
            </Modal.Body>
        </Modal>
    )
}