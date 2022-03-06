import React from 'react'
import CourseCard from "../../components/CourseCard/CourseCard";
import { Container, Row, Col, Form } from 'react-bootstrap'
import img1 from '../../assets/default-course-img-3.PNG'
import img2 from '../../assets/default-course-img-2.PNG'


export default function Courses() {
    const title = 'Introduction to Optimization'
    const author = "Dr. John Doe"
    const text = 'In this course, we will learn how to optimize computationally demanding programs.' +
        'we will see many new things along the way, ye syes'

    return (
        <Container fluid className={'vh-100 p-3'}>
            <Container>
                <Form>
                    <Form.Group className={"m-3 mb-5"}>
                        <Form.Control type={"text"} placeholder={'Search for a course...'}/>
                    </Form.Group>
                </Form>
            </Container>
            <Row>
                <Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}>
                    <CourseCard image={img1} title={title} subtitle={author} description={text}/>
                </Col>
                <Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}>
                    <CourseCard image={img2} title={title} subtitle={author} description={text}/>
                </Col>
                <Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}>
                    <CourseCard image={img2} title={title} subtitle={author} description={text}/>
                </Col>
                <Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}>
                    <CourseCard image={img1} title={title} subtitle={author} description={text}/>
                </Col>
                <Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}>
                    <CourseCard image={img1} title={title} subtitle={author} description={text}/>
                </Col>
                {/*<Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}>*/}
                {/*    <CourseCard image={img1} title={title} subtitle={author} description={text}/>*/}
                {/*</Col>*/}
                {/*<Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}>*/}
                {/*    <CourseCard image={img1} title={title} subtitle={author} description={text}/>*/}
                {/*</Col>*/}
            </Row>
        </Container>
    )
}