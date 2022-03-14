import React, { useState } from 'react'
import { ProSidebar, MenuItem, SubMenu, SidebarFooter, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import { Users } from "../../icons/users";
import UserAvatar from '../Avatar'
import { useAuth } from "../AuthContext";
import './Sidebar.scss'

import Menu from './Menu'
import InnerMenu from "./InnerMenu";
import Item, { Icon } from './Item'
import { useNav } from "../NavContext";
import { useNavigate } from "react-router";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import AddCourseModal from "../../modals/AddCourseModal";
import NewCourseModal from "../../modals/NewCourseModal";


export default function Sidebar({ closeSidebar, open }) {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const [modalShow, setModalShow] = useState(false)
    const [addCourseShow, setAddCourseShow] = useState(false)

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
                            <Item icon={'bi-collection'} onClick={() => navigate('/main/courses/student')}>Show all
                                courses</Item>
                        </InnerMenu>
                    </Menu>
                    <Menu title={"Instructor View"}>
                        <InnerMenu title={"My Courses"}>
                            <Item icon={'bi-plus-circle'} onClick={() => setModalShow(true)}>New Course</Item>
                            <Item icon={'bi-collection'} onClick={() => navigate('/main/courses/teacher')}>Show all courses</Item>
                        </InnerMenu>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <Menu>
                        <MenuItem icon={<Icon iconClass={'bi-question-circle'}/>}>Support</MenuItem>
                        <MenuItem icon={<Icon iconClass={'bi-box-arrow-in-left'}/>} onClick={logout}>Sign Out</MenuItem>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>

            <NewCourseModal centered show={modalShow} onHide={() => setModalShow(false)}/>
            <AddCourseModal centered show={addCourseShow} onHide={() => setAddCourseShow(false)}/>
        </>
    )
}