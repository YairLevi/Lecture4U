import { Container, Spinner } from 'react-bootstrap'
import requests from "../../helpers/requests"
import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
import useLoadingEffect from "../../hooks/useLoadingEffect";
import UserLabel from "../../components/UserLabel";


export default function Members() {
    const [members, setMembers] = useState()
    const { id: courseId } = useParams()

    const loading = useLoadingEffect(async function() {
        const res = await requests.get('/course/members', { courseId })
        const data = await res.json()
        setMembers(data)
    }, [])

    return loading ?
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container> :
        <Container>
            <h3 style={{ fontWeight: 'normal' }}>Students</h3>
            {
                members !== [] ?
                    members.map((value, index) => {
                        return <UserLabel key={index} {...value} noMargin={false}/>
                    })
                    :
                    <p>No members of this course</p>
            }
        </Container>
}