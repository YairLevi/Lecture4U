import React, { useEffect, useState } from 'react'
import { ProSidebar, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import { useAuth } from "../../contexts/AuthContext";
import './Sidebar.scss'

import { NavLink, Container, Tab, Tabs } from 'react-bootstrap'
import Menu from './Menu'
import Item, { Icon } from './Item'
import { useLocation } from "react-router";
import initSelect from '../../helpers/sidebarButtons'


export default function Sidebar({ closeSidebar, open }) {
    const { logout } = useAuth()
    const location = useLocation()
    const [selected, setSelected] = useState()

    useEffect(() => {
        const current = location.pathname.split('/')[1]
        setSelected(() => {
            const newSelect = {...initSelect}
            newSelect[current] = true
            return newSelect
        })
    }, [location])


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
                    }} className={'p-4'}
                    >
                        <div className={'logo'} />
                    </NavLink>
                </Container>
                <SidebarContent>
                    <Menu title={"General"}>
                        <Item name={'dashboard'} selected={selected} icon={'bi-person'}>Dashboard</Item>
                        <Item name={'profile'} selected={selected} icon={'bi-person'}>Profile</Item>
                        <Item name={'groups'} selected={selected} icon={'bi-people'}>Groups</Item>
                        <Item name={'courses'} selected={selected} icon={'bi-book'}>Courses</Item>
                    </Menu>
                    <Menu title={"Tools"}>
                        <Item name={'speech'} selected={selected} icon={'bi-mic'}>Speech To Text</Item>
                        <Item name={'ocr'} selected={selected} icon={'bi-type'}>Image To Text</Item>
                        <Item name={'calendar'} selected={selected} icon={'bi-calendar-range'}>Calender</Item>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <Menu>
                        <Item icon={'bi-question-circle'}>Support</Item>
                        <Item icon={'bi-box-arrow-in-left'} onClick={logout}>Sign Out</Item>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
        </>
    )
}