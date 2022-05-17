import { Container, Button, Spinner } from 'react-bootstrap'
import AssignmentTab from "./AssignmentTab";
import AddAssignment from "./modals/AddAssignment";
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import { useParams } from "react-router";
import TeacherAssignmentTab from "./TeacherAssignmentTab";


export default function TeacherAssignmentView() {
    const { id } = useParams()
    const [openModal, setOpenModal] = useState(false)
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async function () {
            setLoading(true)
            const res = await requests.get('/course/teacher/assignments', { courseId: id })
            if (res.status !== 200) return
            const json = await res.json()
            setAssignments(json)
            setLoading(false)
        })()
    }, [])

    return loading ?
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container>
        :
        <Container className={'p-0'}>
            <h3>Assignments:</h3>
            {
                assignments.length === 0 ?
                    <p>No Assignments.</p> :
                    assignments.map((value, index) => {
                    return <TeacherAssignmentTab key={index} id={value._id} {...value}/>
                })
            }
            <Button onClick={() => setOpenModal(true)}>Add Assignment</Button>
            <AddAssignment show={openModal} onHide={() => setOpenModal(false)}/>
        </Container>
}