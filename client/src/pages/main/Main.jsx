import React, { useEffect, useState } from 'react'
import Sidebar from "../../components/Sidebar/Sidebar";
import { Button, Container, Row, Col, Nav } from 'react-bootstrap'
import Navbar from "../../components/Navbar";
import '../../components/CourseCard/CourseCard'
import image1 from '../../assets/default-course-img-2.PNG'
import CourseCard from "../../components/CourseCard/CourseCard";
import MainNavbar from "../../components/MainNavbar"
import StudentCourses from "../courses/StudentCourses";
import Player from "../video-player/VideoPlayer";
import { Route, Routes } from 'react-router-dom'
import TeacherCourses from "../courses/TeacherCourses";
import StudentCoursePage from "../courses/StudentCoursePage";
import TeacherCoursePage from "../courses/TeacherCoursePage";
import SpeechToTest from "../speechToText/SpeechToText";
import Course from "../Course";
import { useRefresh } from "../../hooks/useRefresh";


import { useCourse } from "../../components/CourseContext";
import { courseTabs } from "../Course";
import Calendar from "../Calendar/Calendar";
import { useLocation, useNavigate } from "react-router";

export default function Main() {
    const [open, setOpen] = useState(false)
    const [sticky, setSticky] = useState('top')
    const { course } = useCourse()
    const navigate = useNavigate()

    const openSidebar = () => {
        setOpen(true)
        setSticky(null)
    }

    const closeSidebar = () => {
        setOpen(false)
        setSticky('top')
    }

    return (
        <div className={'d-flex vh-100'}>
            <Sidebar closeSidebar={() => closeSidebar()} open={open}/>
            <Container fluid className={'d-flex fluid flex-column p-0 vh-100'}>
                <MainNavbar openSidebar={() => openSidebar()} isSticky={false}>
                    {
                        course && courseTabs.map((value, index) => {
                            return (
                                <Nav.Item key={index}>
                                    <Nav.Link onClick={() => {
                                        navigate(`/main/courses/student/${value.toLowerCase()}?courseId=${course}`)
                                    }}>
                                        {value}
                                    </Nav.Link>
                                </Nav.Item>
                            )
                        })
                    }
                </MainNavbar>
                <Container fluid className={'h-100 overflow-auto'}>
                    <Routes>
                        {/*<PlaceholderPage/>*/}

                        <Route path={'/courses/student'} element={<StudentCourses/>}/>
                        {/*<Route path={'/courses'} element={<StudentCourses/>}/>*/}
                        <Route path={'/courses/teacher'} element={<TeacherCourses/>}/>
                        <Route path={'/courses/student/*'} element={<Course/>}/>
                        <Route path={'/courses/teacher/*'} element={<TeacherCoursePage/>}/>
                        <Route path={'/speech'} element={<SpeechToTest/>}/>
                        <Route path={'/calendar'} element={<Calendar/>}/>
                        {/*<Player/>*/}
                    </Routes>
                </Container>
            </Container>
        </div>
    )
}