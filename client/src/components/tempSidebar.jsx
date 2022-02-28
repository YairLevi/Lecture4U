import React from 'react'
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarFooter, SidebarHeader } from 'react-pro-sidebar';
import './custom.scss'

import { Users } from "../icons/users";
import { ChartBar } from "../icons/chart-bar";


export default function YES(props) {
    const { onClose, open } = props

    return (
        <>
            <ProSidebar className={"font-sidebar vh-100 border-end"}
                        breakPoint="lg"
                        width={'250px'}
                        toggled={open}
                        onToggle={onClose}
            >
                <Menu className={"h-99"}>
                    <MenuItem className={"on-hover"}>Dashboard</MenuItem>
                    <MenuItem>Dashboard</MenuItem>
                    <SubMenu title="Components" icon={<Users/>}>
                        <MenuItem>Component 1</MenuItem>
                        <MenuItem>Component 2</MenuItem>
                        <SubMenu title="Component 3">
                            <MenuItem>Component 1</MenuItem>
                            <MenuItem>Component 2</MenuItem>
                        </SubMenu>
                    </SubMenu>
                </Menu>
                <SidebarFooter>
                    <Menu>
                        <MenuItem icon={<ChartBar/>}>Sign Out</MenuItem>
                    </Menu>
                </SidebarFooter>
            </ProSidebar>
        </>
    )
}