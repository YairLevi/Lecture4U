import React from 'react'
import { SubMenu, Menu } from "react-pro-sidebar";
import { Icon } from './Item'

export default function InnerMenu({ children, title, icon, onClick, open }) {
    if (!icon) icon = 'bi-border'
    return (
        <SubMenu title={title} icon={<Icon iconClass={`bi ${icon}`}/>} onClick={onClick} open={open}>
            <Menu style={{ borderBottom: '2px solid lightgray' , marginTop: -20 }}>
                {children}
            </Menu>
        </SubMenu>
    )
}