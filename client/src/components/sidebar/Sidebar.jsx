import React from 'react'
import { ProSidebar, MenuItem, SubMenu, SidebarFooter, SidebarHeader, SidebarContent } from 'react-pro-sidebar';
import { Users } from "../../icons/users";
import UserAvatar from '../Avatar'
import { useAuth } from "../AuthContext";
import './Sidebar.scss'

import Menu from './Menu'


function Icon({ iconClass }) {
    return <i style={{ fontSize: '1.2rem' }} className={`bi ${iconClass}`}/>
}

function Item({ children, icon }) {
    if (!icon) icon = 'bi-border'
    return <MenuItem className={'hover'} icon={<Icon iconClass={icon}/>}>{children}</MenuItem>
}

export default function Sidebar({ closeSidebar, open }) {
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
                <Menu>
                    <MenuItem icon={<Users/>} className={"hover"}>Dashboard</MenuItem>
                    <Item>Dashboard</Item>
                    <SubMenu title="Components" icon={<Users/>}>
                        <MenuItem>Component 1</MenuItem>
                        <MenuItem>Component 2</MenuItem>
                        <SubMenu title="Component 3">
                            <MenuItem>Component 1</MenuItem>
                            <MenuItem>Component 2</MenuItem>
                            <SubMenu title="Hello" icon={<Users/>}>
                                <MenuItem>Component 1</MenuItem>
                                <MenuItem>Component 2</MenuItem>
                            </SubMenu>
                        </SubMenu>
                    </SubMenu>
                    <MenuItem className={"on-hover"}>Dashboard</MenuItem>
                    <MenuItem>UNder</MenuItem>
                    <SubMenu className={'on-hover'} title="Components">
                        <Menu style={{ borderLeft: '2px solid black', marginTop: -10 }}>
                            <MenuItem className={'on-hover'}>Component 1</MenuItem>
                            <MenuItem>Component 2</MenuItem>
                        </Menu>
                    </SubMenu>
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