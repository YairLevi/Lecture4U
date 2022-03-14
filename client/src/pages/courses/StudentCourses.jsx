import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import CourseList, { CardSlot } from "../../components/CourseList";


const title = 'Introduction to  Optimization In Numerical ways of seeing any number of gorups'
const author = "Dr. John Doe"
const text = 'In this course, we will learn how to optimize computationally demanding programs.' +
    'we will see many new things along the way, ye syes'

export default function StudentCourses() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const options = { credentials: 'include' }
            const res = await fetch('http://localhost:8000/course/student', options)
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