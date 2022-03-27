import React, { useState } from 'react'
import { Container, Card, Button } from "react-bootstrap";
import Unit from './Unit'
import { Icon } from "../../components/Sidebar/Item";


async function getCourseData(courseId) {
    const res = await fetch('http://localhost:8000/co')
}

export default function StudentCoursePage(props) {
    return (
        <Container className={'p-3'}>
            <h1 style={{ fontSize: '4rem' }}>Course Name</h1>
            <h5>By Dr. John Doe</h5>
            <Unit/>
        </Container>
    )
}