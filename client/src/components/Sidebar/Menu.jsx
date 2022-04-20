import React from 'react'
import { Menu as DefaultMenu, MenuItem } from 'react-pro-sidebar'
import './Sidebar.scss'


export default function Menu({ children, title }) {
    return (
        <DefaultMenu>
            {!title ? <></> : <MenuItem className={'mt-2 mb-1 title1'}>{title}</MenuItem>}
            <DefaultMenu className={'p-2 pt-0'}>{children}</DefaultMenu>
        </DefaultMenu>
    )
}