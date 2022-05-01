import React, { useEffect, useState } from 'react'
import Sidebar from "../../components/Sidebar/Sidebar";
import { Button, Container, Row, Col, Nav } from 'react-bootstrap'
import '../../components/CourseCard/CourseCard'
import CourseCard from "../../components/CourseCard/CourseCard";
import MainNavbar from "../../components/MainNavbar"
import { Route, Routes, useParams, useSearchParams } from 'react-router-dom'
import SpeechToTest from "../speechToText/SpeechToText";
import Ocr from "../ImageRecognition/ocr";
import Course from "../Courses/Course";

import { useCourse } from "../../components/CourseContext";
import { courseTabs } from "../Courses/Course";
import Calendar from "../Calendar/Calendar";
import Courses from "../Courses/Courses";
import { useNav } from "../../hooks/NavContext";

export default function Main() {
    const [open, setOpen] = useState(false)
    const { course } = useCourse()
    const { rnav } = useNav()
    const { id } = useParams()
    const [params, setParams] = useSearchParams()

    return (
        <div className={'d-flex vh-100'}>
            <Sidebar closeSidebar={() => setOpen(false)} open={open}/>
            <Container fluid className={'d-flex fluid flex-column p-0 vh-100'}>
                <MainNavbar openSidebar={() => setOpen(true)}>
                    {
                        course && courseTabs.map((value, index) => {
                            return (
                                <Nav.Item key={index}>
                                    <Nav.Link onClick={async () => rnav(`/${value.toLowerCase()}`, {}, false)}>
                                        {value}
                                    </Nav.Link>
                                </Nav.Item>
                            )
                        })
                    }
                </MainNavbar>
                <Container fluid className={'h-100 overflow-auto'}>
                    <Routes>
                        <Route path={'/Courses'} element={<Courses/>}/>
                        <Route path={'/course/:id/*'} element={<Course/>}/>
                        <Route path={'/speech'} element={<SpeechToTest/>}/>
                        <Route path={'/calendar'} element={<Calendar/>}/>
                        <Route path={'/ocr'} element={<Ocr/>}/>
                    </Routes>
                </Container>
            </Container>
        </div>
    )
}