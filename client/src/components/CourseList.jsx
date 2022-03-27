import React, { useState } from 'react'
import { Col, Container, FormControl, InputGroup, Row } from "react-bootstrap";
import CourseCard from "./CourseCard/CourseCard";


export function CardSlot(props) {
    return (
        <Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}>
            <CourseCard {...props}/>
        </Col>
    )
}

export default function CourseList(props) {
    return (
        <Container fluid className={'vh-100 p-3'}>
            <Container>
                <InputGroup className="mb-5">
                    <FormControl placeholder="Search for a course..."/>
                </InputGroup>
            </Container>
            <Row>
                {props.children}
            </Row>
        </Container>
    )
}