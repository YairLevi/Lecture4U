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
import Editor from "../Groups/Editor";
import DashboardPage from "../Dashboard/DashboardPage";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function Main() {
    const [open, setOpen] = useState(false)
    const { siblingNav } = useNav()
    const params = useParams()
    const [searchParams,] = useSearchParams()
    const state = useLocalStorage('state')
    const [inCourse, setInCourse] = useState(false)

    useEffect(() => {
        setInCourse(params['*'].split('/')[0] === 'courses' && params['*'].split('/').length > 1)
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
                                    <Nav.Link onClick={async () => siblingNav(`/${value.toLowerCase()}`, {}, false)}>
                                        {value}
                                    </Nav.Link>
                                </Nav.Item>
                            )
                        })
                    }
                </MainNavbar>
                <Container fluid className={'h-100 overflow-auto'}>
                    <Routes>
                        <Route path={'/dashboard'} element={<DashboardPage/>}/>
                        <Route path={'/profile'} element={<ProfilePage/>}/>
                        <Route path={'/groups'} element={<GroupsPage/>}/>
                        <Route path={'/groups/:id'} element={<Group/>}/>
                        <Route path={'/groups/:id/document/:docId'} element={<Editor/>}/>
                        <Route path={'/courses'} element={<Courses/>}/>
                        <Route path={'/courses/:id/*'} element={<Course/>}/>
                        <Route path={'/speech'} element={<SpeechToText/>}/>
                        <Route path={'/calendar'} element={<Calendar/>}/>
                        <Route path={'/ocr'} element={<Ocr/>}/>
                    </Routes>
                </Container>
            </Container>
        </div>
    )
}