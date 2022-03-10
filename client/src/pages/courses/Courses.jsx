import React, { useEffect, useState } from 'react'
import CourseCard from "../../components/CourseCard/CourseCard";
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap'
import img1 from '../../assets/default-course-img-1.PNG'
import img2 from '../../assets/default-course-img-2.PNG'
import img3 from '../../assets/default-course-img-3.PNG'
import AddCourseModal from "../../components/AddCourseModal";


const title = 'Introduction to  Optimization In Numerical ways of seeing any number of gorups'
const author = "Dr. John Doe"
const text = 'In this course, we will learn how to optimize computationally demanding programs.' +
    'we will see many new things along the way, ye syes'


function onSearchBarInput(e) {
    const value = e.target.value

}

function Slot(props) {
    return <Col className={'col-12 col-md-6 col-lg-4 col-xl-3'}><CourseCard {...props}/></Col>
}

export default function Courses() {
    const [modalShow, setModalShow] = useState(false)
    const [courseList, setCourseList] = useState([])
    const [loading, setLoading] = useState(false)

    // useEffect(async () => {
    //     setLoading(true)
    //     const options = { credentials: 'include' }
    //     const res = await fetch('http://localhost:8000/user/courses', options)
    //     const data = await res.json()
    //     setCourseList(data.courses)
    // }, [])

    return (
        <>
            <Container fluid className={'vh-100 p-3'}>
                <Container>
                    <InputGroup className="mb-5">
                        <FormControl placeholder="Search for a course..."/>
                        <Button variant="outline-primary" onClick={() => setModalShow(true)}>Add Course</Button>
                    </InputGroup>
                </Container>
                <Row>
                    {/*{courseList?.map(value => <Slot {...Object.values(value)}/>)}*/}
                    <Slot image={img1} title={title} subtitle={author} description={text}/>
                    <Slot image={img1} title={'hello'} subtitle={author} description={text}/>
                    <Slot image={img1} title={'hello'} subtitle={author} description={text}/>
                    <Slot image={img1} title={'hello'} subtitle={author} description={text}/>
                    <Slot image={img1} title={'hello'} subtitle={author} description={text}/>
                    <Slot image={img1} title={'hello'} subtitle={author} description={text}/>
                </Row>
            </Container>


            <AddCourseModal centered show={modalShow} onHide={() => setModalShow(false)}/>
        </>
    )
}