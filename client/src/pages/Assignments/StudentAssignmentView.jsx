import { Container, Button, Spinner, Card } from 'react-bootstrap'
import AssignmentTab from "./AssignmentTab";
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import { useParams } from "react-router";
import SubmitAssignment from "./modals/SubmitAssignment";
import AssignmentContent from "./AssignmentContent";
import SubmissionContent from "./SubmissionContent";
import EditSubmission from "./modals/EditSubmission";
import useLoadingEffect from "../../hooks/useLoadingEffect";


export default function Assignments() {
    const { id } = useParams()
    const [active, setActive] = useState([])
    const [submitted, setSubmitted] = useState([])
    const [openSubmit, setOpenSubmit] = useState(false)
    const [assignmentId, setAssignmentId] = useState(null)
    const [openEdit, setOpenEdit] = useState(false)

    const loading = useLoadingEffect(async function () {
        let res = await requests.get('/course/assignments', { courseId: id })
        if (res.status !== 200) return
        const json = await res.json()
        console.log(json)
        for (const assignment of json) {
            if (assignment.submissions.length === 0) {
                setActive(prev => [...prev, assignment])
            } else {
                setSubmitted(prev => [...prev, assignment])
            }
        }
    }, [])


    return loading ?
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container>
        :
        <Container className={'p-2 pb-5'}>
            <div className={'ms-auto me-auto'} style={{ width: '80%' }}>
                <Container>
                    <h3 style={{ fontWeight: 'normal' }}>Active</h3>
                    {
                        active.length === 0 ?
                            <p>No Active Assignments</p> :
                            active.map((value, index) => {
                                return (
                                    <AssignmentTab key={index} id={value._id} {...value}>
                                        <AssignmentContent text={value.text} files={value.files}/>
                                        <Button className={'mt-3'} onClick={() => {
                                            setOpenSubmit(true)
                                            setAssignmentId(value._id)
                                        }}>
                                            Submit
                                        </Button>
                                    </AssignmentTab>
                                )
                            })
                    }
                </Container>
                <Container className={'mt-5'}>
                    <h3 style={{ fontWeight: 'normal' }}>Submitted</h3>
                    {
                        submitted.length === 0 ?
                            <p>No Submitted Assignments</p> :
                            submitted.map((value, index) => {
                                return (
                                    <AssignmentTab key={index} id={value._id} {...value}>
                                        <SubmissionContent submission={value.submissions[0]} assignmentId={value._id} asStudent={true}/>
                                        <div className={'mt-2 w-100 border-1 border-top'}>
                                            <Card.Text className={'mt-3'}>
                                                Assignment Preview
                                            </Card.Text>
                                        </div>
                                        <Card className={'mt-3'}>
                                            <Card.Body>
                                                <AssignmentContent text={value.text} files={value.files}/>
                                            </Card.Body>
                                        </Card>
                                    </AssignmentTab>
                                )
                            })
                    }
                </Container>
            </div>
            <SubmitAssignment show={openSubmit} onHide={() => setOpenSubmit(false)} assignmentId={assignmentId}/>
        </Container>

}