import { Container, Button, Spinner } from 'react-bootstrap'
import AssignmentTab from "./AssignmentTab";
import AddAssignment from "./modals/AddAssignment";
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import TeacherAssignmentTab from "./TeacherAssignmentTab";
import SubmissionTab from "./SubmissionTab";


export default function SubmissionView() {
    const { assignmentId } = useParams()
    const [loading, setLoading] = useState(false)
    const [searchParams] = useSearchParams()
    const [submissions, setSubmissions] = useState([])
    const isTeacher = searchParams.get('state') === 'teacher'

    useEffect(() => {
        (async function () {
            setLoading(true)
            const res = await requests.get('/course/teacher/submissions', { assignmentId })
            if (res.status !== 200) return
            const json = await res.json()
            setSubmissions(json)
            setLoading(false)
        })()
    }, [])

    return loading ?
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container>
        :
        <Container className={'p-0'}>
            <h3>Submissions</h3>
            {
                submissions.length === 0 ?
                    <p>No Submissions yet</p> :
                    submissions.map((value, index) => {
                        return <SubmissionTab key={index} id={value._id} value={value}/>
                    })
            }
        </Container>
}