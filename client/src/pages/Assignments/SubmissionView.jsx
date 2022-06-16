import { Container, Button, Spinner, Card } from 'react-bootstrap'
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import { useParams } from "react-router";
import SubmissionContent from "./SubmissionContent";
import useLoadingEffect from "../../hooks/useLoadingEffect";
import { useSearchParams } from "react-router-dom";


export default function SubmissionView() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [submissions, setSubmissions] = useState([])

    const loading = useLoadingEffect(async () => {
        const res = await requests.get('/course/teacher/submissions', { assignmentId: searchParams.get('assignmentId') })
        if (res.status !== 200) return
        const json = await res.json()
        setSubmissions(json)
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
                    <Card>
                        <Card.Body>
                            <SubmissionContent submissions={submissions} asStudent={false}/>
                        </Card.Body>
                    </Card>
            }
        </Container>
}