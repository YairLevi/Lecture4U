import { MenuItem } from "react-pro-sidebar";
import React from "react";

export function Icon({ iconClass }) {
    return <i style={{ fontSize: '1.2rem' }} className={`bi ${iconClass}`}/>
}

export default function Item({ children, icon, onClick }) {
    if (!icon) icon = 'bi-border'
    return <MenuItem className={'hover'} icon={<Icon iconClass={icon}/>}
                     onClick={onClick}>
        {children}
    </MenuItem>
}