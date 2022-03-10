import React, { useEffect, useState } from "react";
import axios from "axios";
import img1 from './images/default-course-img-1.PNG'
import { Card, Container, Row, Col, CardGroup, Image } from 'react-bootstrap'
import './course-card.css'
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import { CourseCard } from "./components/Course";


export default function App() {
    const title = 'Loading...'
    const author = ""
    const text = ''
    const [image, setImage] = useState(null)

    useEffect(async () => {
        const res = await fetch('http://localhost:8000/courses')
        const data = await res.json()
        console.log(data)
        setImage(data.image)
    }, [])

    return (
        <Container fluid className={'vh-100 p-5'}
                   style={{ backgroundColor: '#4c8fb4' }}>
            <Row>
                <Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}>
                    <CourseCard image={image} title={title} subtitle={author} description={text}/>
                </Col>
            </Row>
        </Container>
    );
}