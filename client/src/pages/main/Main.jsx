import React, { useState } from 'react'
import Sidebar from "../../components/Sidebar/Sidebar";
import { Button, Container, Row, Col } from 'react-bootstrap'
import Navbar from "../../components/Navbar";
import '../../components/CourseCard/CourseCard'
import image1 from '../../assets/default-course-img-2.PNG'
import CourseCard from "../../components/CourseCard/CourseCard";
import MainNavbar from "../../components/MainNavbar"
import StudentCourses from "../courses/StudentCourses";
import Player from "../video-player/VideoPlayer";
import { Route, Routes } from 'react-router-dom'
import TeacherCourses from "../courses/TeacherCourses";
import NavProvider from "../../components/NavContext";


function PlaceholderPage() {
    return (
        <Container fluid className={'p-5'}>
            <h1>This is a placeholder page. Hello!</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>|</h1>
            <h1>Text</h1>
        </Container>
    )
}


export default function Main() {
    const [open, setOpen] = useState(false)
    const [sticky, setSticky] = useState('top')

    const openSidebar = () => {
        setOpen(true)
        setSticky(null)
    }

    const closeSidebar = () => {
        setOpen(false)
        setSticky('top')
    }

    const title = 'This is the title'
    const author = "I'm the author"
    const text = 'Hello everyone! This is Me, typing some shit right here'

    return (
        <NavProvider>
            <div className={'d-flex vh-100'}>
                <Sidebar closeSidebar={() => closeSidebar()} open={open}/>
                <Container fluid className={'p-0 h-100 overflow-auto'}>
                    <MainNavbar openSidebar={() => openSidebar()} isSticky={sticky}/>
                    <Routes>
                        {/*<PlaceholderPage/>*/}
                        <Route path={'/courses/student'} element={<StudentCourses/>}/>
                        {/*<Route path={'/courses'} element={<StudentCourses/>}/>*/}
                        <Route path={'/courses/teacher'} element={<TeacherCourses/>}/>

                        {/*<Player/>*/}
                    </Routes>
                </Container>
            </div>
        </NavProvider>
    )
}