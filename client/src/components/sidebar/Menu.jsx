import React from 'react'
import { Menu as DefaultMenu, MenuItem } from 'react-pro-sidebar'


export default function Menu({ children, title }) {
    return (
        <DefaultMenu>
            <MenuItem className={'mt-2'} style={{ color: 'gray' }}>
                {title}
            </MenuItem>
            <DefaultMenu className={'p-2 pt-0'}>
                {children}
            </DefaultMenu>
        </DefaultMenu>
    )
}