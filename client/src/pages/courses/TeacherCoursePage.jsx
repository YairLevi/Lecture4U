import React, { useEffect, useState } from 'react'
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { Icon } from "../../components/Sidebar/Item";
import AddUnit from "../../modals/AddUnit";
import { useLocation } from "react-router";
import requests from "../../helpers/requests";
import Unit from "./Unit";
import AddSubject from "../../modals/AddSubject";


function getCourseID(location) {
    const path = location.pathname
    const arr = path.split('/')
    return arr[arr.length - 1]
}

export default function TeacherCoursePage() {
    const [showAddUnit, setShowAddUnit] = useState(false)
    const [data, setData] = useState(null)
    const location = useLocation()

    useEffect(async () => {
        const id = getCourseID(location)
        const res = await requests.get('/course/data', { code: id })
        if (res.status !== 200) {
            // error
        } else {
            const json = await res.json()
            setData(json)
        }
    }, [])

    return !data ? <Spinner animation={'border'}/> : (
        <>
            <Container className={'p-3'}>
                <h1 style={{ fontSize: '4rem' }}>{data.name}</h1>
                <h5>By {data.teacher}</h5>
                <h6>{data.description}</h6>
                {data.units.map(value => {
                    return <Unit key={value._id} name={value.name} text={value.text} subjects={value.subjects}/>
                })}
                <Button className={'mt-3 mb-3'} onClick={() => setShowAddUnit(true)}>
                    <Icon iconClass={'bi-plus-circle'}/>
                    Add Unit
                </Button>
            </Container>

            <AddUnit show={showAddUnit} onHide={() => setShowAddUnit(false)}/>
        </>
    )
}