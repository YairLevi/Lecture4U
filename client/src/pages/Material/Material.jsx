import React, { useEffect, useState } from 'react'
import { Container, Card, Button, Spinner } from "react-bootstrap";
import Unit from './Unit'
import { Icon } from "../../components/Sidebar/Item";
import { useLocation, useSearchParams } from "react-router-dom";
import requests from "../../helpers/requests";
import AddUnit from "../../modals/AddUnit";
import { useCourse } from "../../components/CourseContext";
import { useParams } from "react-router";


// function getCourseID(location) {
//     const params = requests.parseParams(location)
//     return params.courseId
// }

export default function Material(props) {
    const [showAddUnit, setShowAddUnit] = useState(false)
    const [data, setData] = useState(null)
    const location = useLocation()
    const { updateCourse } = useCourse()
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const isTeacher = searchParams.get('state') === 'teacher'


    useEffect(async () => {
        // const id = getCourseID(location)
        updateCourse(id)
        const res = await requests.get('/course/data', { code: id })
        if (res.status !== 200) {
            // error. put some error screen here.
        } else {
            const json = await res.json()
            setData(json)
        }
    }, [])

    return !data ? (
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container>
    ) : (
        <>
            <Container className={'p-3'}>
                <h1 style={{ fontSize: '2rem' }}>{data.name}</h1>
                <h5 style={{ color: "gray" }}>By {data.teacher}</h5>
                <br/>
                <h6>{data.description}</h6>
                {data.units.map((value, index) => {
                    return <Unit key={index}
                                 courseId={data._id}
                                 unitId={value._id}
                                 name={value.name}
                                 text={value.text}
                                 subjects={value.subjects}
                                 isTeacher={isTeacher}
                    />
                })}
                {
                    isTeacher && <Button className={'mt-3 mb-3'} onClick={() => setShowAddUnit(true)}>
                        <Icon iconClass={'bi-plus-circle'}/>
                        Add Unit
                    </Button>
                }
            </Container>

            <AddUnit show={showAddUnit} onHide={() => setShowAddUnit(false)}/>
        </>
    )
}