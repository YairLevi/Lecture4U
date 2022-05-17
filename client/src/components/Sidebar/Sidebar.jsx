import React, { useState } from 'react'
import { ProSidebar, MenuItem, SubMenu, SidebarFooter, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import { Users } from "../../icons/users";
import UserAvatar from '../Avatar'
import { useAuth } from "../../contexts/AuthContext";
import './Sidebar.scss'

import { Container } from 'react-bootstrap'
import Menu from './Menu'
import InnerMenu from "./InnerMenu";
import Item, { Icon } from './Item'
import { useNavigate } from "react-router";
import { Button, FormControl, InputGroup, Nav, Navbar as Bar } from "react-bootstrap";
import AddCourse from "../../modals/AddCourse";
import NewCourse from "../../modals/NewCourse";
import { useSearchParams } from 'react-router-dom'
import { useNav } from "../../contexts/NavContext";
import { NavLink } from 'react-bootstrap'


export default function Sidebar({ closeSidebar, open }) {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [modalShow, setModalShow] = useState(false)
    const [addCourseShow, setAddCourseShow] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const { nav, fullNav } = useNav()

    return (
        <>
            <ProSidebar className={"font-sidebar vh-100 border-end"}
                        breakPoint="xl"
                        toggled={open}
                        onToggle={closeSidebar}
            >
                <Container className={'d-flex justify-content-center align-items-center'}>
                    <NavLink href="/" style={{
                        color: "black",
                        fontSize: '2rem',
                        fontWeight: 'normal',
                    }} className={'p-4'}>
                        Lecture4U
                    </NavLink>
                </Container>
                <SidebarContent>

                    <Menu title={"General"}>
                        <Item icon={'bi-person'} onClick={() => fullNav('/main')}>Dashboard</Item>
                        <Item icon={'bi-person'} onClick={() => fullNav('/main/profile')}>Profile</Item>
                        <Item icon={'bi-people'} onClick={() => fullNav('/main/groups')}>Groups</Item>
                    </Menu>
                    <Menu title={"Student View"}>
                        <InnerMenu title={"Courses"} icon={'bi-book'}>
                            <Item icon={'bi-plus-circle'} onClick={() => setAddCourseShow(true)}>Add Course</Item>
                            <Item icon={'bi-collection'}
                                  onClick={() => fullNav('/main/courses', { state: 'student' }, false)}>
                                Show all courses
                            </Item>
                        </InnerMenu>
                    </Menu>
                    <Menu title={"Teacher View"}>
                        <InnerMenu title={"My Courses"}>
                            <Item icon={'bi-plus-circle'} onClick={() => setModalShow(true)}>New Course</Item>
                            <Item icon={'bi-collection'}
                                  onClick={() => fullNav('/main/courses', { state: 'teacher' }, false)}>
                                Show all courses
                            </Item>
                        </InnerMenu>
                    </Menu>
                    <Menu title={"Tools"}>
                        <Item icon={'bi-mic'} onClick={() => fullNav('/main/speech', {}, false)}>Speech To Text</Item>
                        <Item icon={'bi-type'} onClick={() => fullNav('/main/ocr', {}, false)}>Image To Text</Item>
                        <Item icon={'bi-calendar-range'} onClick={() => fullNav('/main/calendar', {}, false)}>Calender</Item>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <Menu>
                        <Item icon={'bi-question-circle'}>Support</Item>
                        <Item icon={'bi-box-arrow-in-left'} onClick={logout}>Sign Out</Item>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>

            <NewCourse centered show={modalShow} onHide={() => setModalShow(false)}/>
            <AddCourse centered show={addCourseShow} onHide={() => setAddCourseShow(false)}/>
        </>
    )
}