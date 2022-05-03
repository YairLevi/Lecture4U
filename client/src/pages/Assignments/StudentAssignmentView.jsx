import { Container, Button, Spinner } from 'react-bootstrap'
import AssignmentTab from "./AssignmentTab";
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import { useParams } from "react-router";


export default function Assignments() {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [active, setActive] = useState([])
    const [submitted, setSubmitted] = useState([])

    useEffect(() => {
        (async function () {
            setLoading(true)
            let res = await requests.get('/course/assignments', { courseId: id })
            if (res.status !== 200) return
            const json = await res.json()
            for (const assignment of json) {
                if (assignment.submissions.length === 0) {
                    setActive(prev => [...prev, assignment])
                } else {
                    setSubmitted(prev => [...prev, assignment])
                }
            }
            setLoading(false)
        })()
    }, [])

    return loading ?
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container>
        :
        <Container className={'p-0'}>
            <Container>
                <h3>Active</h3>
                {
                    active.length === 0 ?
                        <p>No Active Assignments</p> :
                        active.map((value, index) => {
                            return <AssignmentTab key={index} id={value._id} {...value}/>
                        })
                }
            </Container>
            <Container className={'mt-5'}>
                <h3>Submitted</h3>
                {
                    submitted.length === 0 ?
                        <p>No Submitted Assignments</p> :
                        submitted.map((value, index) => {
                            return <AssignmentTab key={index} id={value._id} {...value}/>
                        })
                }
            </Container>
        </Container>

}