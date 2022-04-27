import React, { useState } from 'react'
import { ProSidebar, MenuItem, SubMenu, SidebarFooter, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import { Users } from "../../icons/users";
import UserAvatar from '../Avatar'
import { useAuth } from "../AuthContext";
import './Sidebar.scss'

import Menu from './Menu'
import InnerMenu from "./InnerMenu";
import Item, { Icon } from './Item'
import { useNavigate } from "react-router";
import { Button, FormControl, InputGroup, Nav } from "react-bootstrap";
import AddCourse from "../../modals/AddCourse";
import NewCourse from "../../modals/NewCourse";

import { useCourse } from "../CourseContext";


export default function Sidebar({ closeSidebar, open }) {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [modalShow, setModalShow] = useState(false)
    const [addCourseShow, setAddCourseShow] = useState(false)
    const { course } = useCourse()

    return (
        <>
            <ProSidebar className={"font-sidebar vh-100 border-end"}
                        breakPoint="xl"
                        toggled={open}
                        onToggle={closeSidebar}
            >
                <SidebarHeader className={'d-flex justify-content-center align-items-center'}>
                    <UserAvatar name={'John Doe'} email={'johndoe@gmail.com'}/>
                </SidebarHeader>
                <SidebarContent>

                    <Menu title={"General"}>
                        <Item>Profile</Item>
                        <Item>Settings</Item>
                    </Menu>
                    <Menu title={"Student View"}>
                        <InnerMenu title={"Courses"} icon={'bi-book'}>
                            <InnerMenu title={'Recently Visited'} icon={'bi-clock-history'}>
                                <Item>Course 1</Item>
                                <Item>Course 2</Item>
                            </InnerMenu>
                            <Item icon={'bi-plus-circle'} onClick={() => setAddCourseShow(true)}>Add Course</Item>
                            <Item icon={'bi-collection'} onClick={() => navigate('/main/courses/student')}>
                                Show all courses
                            </Item>
                        </InnerMenu>
                    </Menu>
                    <Menu title={"Teacher View"}>
                        <InnerMenu title={"My Courses"}>
                            <Item icon={'bi-plus-circle'} onClick={() => setModalShow(true)}>New Course</Item>
                            <Item icon={'bi-collection'} onClick={() => navigate('/main/courses/teacher')}>
                                Show all courses
                            </Item>
                        </InnerMenu>
                    </Menu>
                    <Menu title={"Tools"}>
                        <Item icon={'bi-mic'} onClick={() => navigate('/main/speech')}>Speech To Text</Item>
                        <Item icon={'bi-type'} onClick={() => navigate('/main/ocr')}>Image To Text</Item>
                        <Item icon={'bi-calendar-range'} onClick={() => navigate('/main/calendar')}>Calender</Item>
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