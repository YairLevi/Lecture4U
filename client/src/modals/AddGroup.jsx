import { useState, useEffect } from 'react'
import { Form, Modal, Button, Container } from 'react-bootstrap'
import { Spinner } from "react-bootstrap";
import requests from "../helpers/requests";


export default function AddGroup(props) {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [courseList, setCourseList] = useState()
    const [name, setName] = useState()
    const [courseId, setCourseId] = useState()

    async function loadModal() {
        setLoading(true)
        const courses = await requests.get('/course/student')
        const data = await courses.json()
        setCourseList(data)
        setLoading(false)
    }

    async function handleSubmit() {
        const res = await requests.post('/groups/create-group', { name, courseId })
    }

    useEffect(() => loadModal(), [])

    return (
        <Modal {...props}>
            <Modal.Header closeButton>
                <Modal.Title>Add Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control
                            type={'text'}
                            onChange={e => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Related Course</Form.Label>
                        <Container style={{ maxHeight: 200, overflow: "auto" }}>
                            <div className="form-check">
                                <input value={'no-course'} onClick={e => setCourseId(e.target.value)}
                                    className="form-check-input" name="courseCheck" type="radio" id={`course0`}/>
                                <label className="form-check-label" htmlFor={`course0`}>
                                    No Course
                                </label>
                            </div>
                            {
                                courseList && courseList.map((value, index) => {
                                    const id = `course${index + 1}`
                                    return (
                                        <div className="form-check" key={index}>
                                            <input className="form-check-input" name="courseCheck" type="radio"
                                                   value={value.id} id={id} onClick={e => setCourseId(e.target.value)}/>
                                            <label className="form-check-label" htmlFor={id}>
                                                <strong>{value.name}</strong> by {value.teacher}
                                            </label>
                                        </div>
                                    )
                                })
                            }
                        </Container>
                    </Form.Group>
                </Form>
                {/*{loading && <Spinner className={'m-3 align-self-center'} animation="border"/>}*/}
                {/*{error && <span className={'alert-danger p-2'}>{error}</span>}*/}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit}>Add Group</Button>
            </Modal.Footer>
        </Modal>
    )
}