import React, { useEffect, useState } from 'react'
import { Container, FormControl, InputGroup, Row, Spinner } from 'react-bootstrap'
import CourseList, { CardSlot } from "../../components/CourseList";


export default function StudentCourses() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const options = { credentials: 'include' }
            const res = await fetch('http://localhost:8000/course/student', options)
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
        <Container fluid className={'vh-100 p-3'}>
            <Container>
                <InputGroup className="mb-5">
                    <FormControl placeholder="Search for a course..." onChange={e => setSearchValue(e.target.value)}/>
                </InputGroup>
            </Container>
            <Row>
                {data && data.map((value, index) => {
                    if (value.name.includes(searchValue))
                        return <CardSlot key={index} {...value}/>
                })}
            </Row>
        </Container>
    )
}