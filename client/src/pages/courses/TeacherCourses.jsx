import React, { useEffect, useState } from 'react'
import CourseList, { CardSlot } from "../../components/CourseList";
import { Spinner } from "react-bootstrap";


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
            setLoading(false)
        }
        fetchData()
    }, [])

    return (
        <CourseList>
            {loading && <Spinner className={'m-3 align-self-center'} animation="border"/>}
            {data && data.map((value, index) => <CardSlot key={index} {...value}/>)}
        </CourseList>
    )
}