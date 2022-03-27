import React, { useEffect, useState } from 'react'
import CourseList, { CardSlot } from "../../components/CourseList";
import { Spinner, Container } from "react-bootstrap";


export default function TeacherCourses() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const options = { credentials: 'include' }
            const res = await fetch('http://localhost:8000/course/teacher', options)
            if (res.status !== 200) return
            const json = await res.json()
            setData(json)
            console.log(json)
            setLoading(false)
        }

        fetchData()
    }, [])

    return loading ? (
            <Container className={'d-flex justify-content-center align-items-center'}>
                <Spinner className={'m-3'} animation="border"/>
            </Container>
        ) : (
        <CourseList>
            {data && data.map((value, index) => <CardSlot key={index} {...value}/>)}
        </CourseList>
    )
}