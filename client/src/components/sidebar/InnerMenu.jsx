import React from 'react'
import { SubMenu, Menu } from "react-pro-sidebar";
import { Icon } from './Item'

export default function InnerMenu({ children, title, icon, onClick }) {
    if (!icon) icon = 'bi-border'
    return (
        <SubMenu title={title} icon={<Icon iconClass={`bi ${icon}`}/>} onClick={onClick}>
            <Menu style={{ borderLeft: '2px solid lightgray', marginTop: -10 }}>
                {children}
            </Menu>
        </SubMenu>
    )
}