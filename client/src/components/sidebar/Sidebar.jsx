import React from 'react'
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


export default function Sidebar({ closeSidebar, open }) {
    const navigate = useNavigate()
    const { logout } = useAuth()

    return (
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
                        <Item>Intro to Artificial Intelligence</Item>
                        <Item>Disruptor Training</Item>
                        <Item>Mo-Money Masterclass</Item>
                        <Item>PerfectPitch Sales Training</Item>
                        <Item>Alpha Entrepreneurs Workshop</Item>
                        <Item onClick={() => navigate('/main/courses')}>
                            Show all courses
                        </Item>
                    </InnerMenu>
                </Menu>
                <Menu title={"Instructor View"}>
                    <InnerMenu title={"My Courses"} onClick={() => navigate('/main/my-courses')}>

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
    )
}