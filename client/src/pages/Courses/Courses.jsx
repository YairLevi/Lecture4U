import React, { useEffect, useState } from 'react'
import { Container, FormControl, InputGroup, Row, Spinner } from 'react-bootstrap'
import CourseList, { CardSlot } from "../../components/CourseList";
import { useSearchParams } from "react-router-dom";
import requests from "../../helpers/requests";


export default function Courses() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [params ,setParams] = useSearchParams()

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const res = await requests.get(`/course/${params.get('state')}`)
            if (res.status !== 200) return
            const json = await res.json()
            setData(json)
            setLoading(false)
        }
        fetchData()
    }, [params])


    return loading ? (
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container>
    ) : (
        <Container fluid className={'h-100 p-3'}>
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