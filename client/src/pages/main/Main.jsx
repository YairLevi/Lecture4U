import React, { useEffect, useState } from 'react'
import Sidebar from "../../components/Sidebar/Sidebar";
import { Button, Container, Row, Col, Nav } from 'react-bootstrap'
import '../../components/CourseCard/CourseCard'
import CourseCard from "../../components/CourseCard/CourseCard";
import MainNavbar from "../../components/Navbars/MainNavbar"
import { Route, Routes, useParams, useSearchParams } from 'react-router-dom'
import Ocr from "../ImageRecognition/ocr";
import Course from "../Courses/Course";
import GroupsPage from "../Groups/GroupsPage";

import { courseTabs } from "../Courses/Course";
import Calendar from "../Calendar/Calendar";
import Courses from "../Courses/Courses";
import { useNav } from "../../contexts/NavContext";
import Group from "../Groups/Group";
import ProfilePage from "../Profile/ProfilePage";
import SpeechToText from "../speechToText/SpeechToText";

export default function Main() {
    const [open, setOpen] = useState(false)
    const { rnav } = useNav()
    const params = useParams()
    const [inCourse, setInCourse] = useState(false)

    useEffect(() => {
        setInCourse(params['*'].split('/')[0] === 'course')
    }, [params])

    return (
        <div className={'d-flex vh-100'}>
            <Sidebar closeSidebar={() => setOpen(false)} open={open}/>
            <Container fluid className={'d-flex fluid flex-column p-0 vh-100'}>
                <MainNavbar openSidebar={() => setOpen(true)}>
                    {
                        inCourse && courseTabs.map((value, index) => {
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
                <Container fluid className={'h-100 overflow-auto'} /*style={{ backgroundColor: '#e0e4ec' }}*/>
                    <Routes>
                        <Route path={'/profile'} element={<ProfilePage />} />
                        <Route path={'/groups'} element={<GroupsPage />} />
                        <Route path={'/groups/:id'} element={<Group />} />
                        <Route path={'/courses'} element={<Courses/>}/>
                        <Route path={'/course/:id/*'} element={<Course/>}/>
                        <Route path={'/speech'} element={<SpeechToText/>}/>
                        <Route path={'/calendar'} element={<Calendar/>}/>
                        <Route path={'/ocr'} element={<Ocr/>}/>
                    </Routes>
                </Container>
            </Container>
        </div>
    )
}