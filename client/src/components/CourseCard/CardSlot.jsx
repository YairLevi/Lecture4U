import React from 'react'
import { Col } from "react-bootstrap";
import CourseCard from "./CourseCard";


export default function CardSlot(props) {
    return (
        <Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}>
            <CourseCard {...props}/>
        </Col>
    )
}