import { Container, Button, Spinner, Card } from 'react-bootstrap'
import AddAssignment from "./modals/AddAssignment";
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import { useParams } from "react-router";
import AssignmentTab from "./AssignmentTab";
import AssignmentContent from "./AssignmentContent";
import { useSearchParams } from "react-router-dom";
import SubmissionView from "./SubmissionView";


export default function TeacherAssignmentView() {
    const { id } = useParams()
    const [openModal, setOpenModal] = useState(false)
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

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
        !searchParams.get('assignmentId') ?
            <Container className={'p-0'}>
                <div className={'ms-auto me-auto'} style={{ width: '75%' }}>
                    <h3 style={{ fontWeight: 'normal' }}>Assignments</h3>
                    {
                        assignments.length === 0 ?
                            <p>No Assignments.</p> :
                            assignments.map((value, index) => {
                                return (
                                    <AssignmentTab key={index} id={value._id} {...value}>
                                        <AssignmentContent text={value.text} files={value.files}/>
                                        <Button className={'mt-3'}
                                                onClick={() => setSearchParams({ assignmentId: value._id })}>View All
                                            Submissions</Button>
                                    </AssignmentTab>
                                )
                            })
                    }
                    <Button className={'mt-3'} onClick={() => setOpenModal(true)}>Add Assignment</Button>
                </div>
                <AddAssignment show={openModal} onHide={() => setOpenModal(false)}/>
            </Container>
            :
            <SubmissionView />
}