import { MenuItem } from "react-pro-sidebar";
import React from "react";
import { useNav } from "../../contexts/NavContext";

export function Icon({ iconClass }) {
    return <i style={{ fontSize: '1rem' }} className={`bi ${iconClass}`}/>
}

const style = {
    backgroundColor: '#007bff',
    color: '#ffffff',
    borderRadius: '1rem'
}

export default function Item({ children, icon, name, selected, onClick }) {
    if (!icon) icon = 'bi-border'
    const { fullNav } = useNav()

    return (
        <MenuItem icon={<Icon iconClass={icon}/>} onClick={onClick ? onClick : () => {fullNav(`/${name}`)}} style={
            !selected || !selected[name] ? {} : style
        }>
            {children}
        </MenuItem>
    )
}