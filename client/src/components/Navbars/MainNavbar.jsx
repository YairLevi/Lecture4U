import React, { useState } from "react";
import { Navbar as Bar, Button, Form, Nav, NavDropdown, Container, NavLink } from "react-bootstrap";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import UserAvatar from "../Avatar";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../../contexts/AuthContext";



function SideButton({ onClick, breakpoint }) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up(breakpoint));

    return matches ? <></> : (
        <Button className={'bg-light btn-outline-light me-3'} onClick={onClick}>
            <div className={'navbar-toggler-icon'}/>
        </Button>
    )
}

export default function MainNavbar({ openSidebar, isSticky, children }) {
    const { currentUser } = useAuth()

    return (
        <Bar className={"p-3"} bg={"white"} expand="xl" sticky={isSticky}>
            <SideButton breakpoint={'lg'} onClick={openSidebar}/>
            <Bar.Toggle aria-controls="main-Bar-nav"/>
            <Bar.Collapse id="main-Bar-nav">
                <Nav variant={'pills'} className={'me-auto'}>
                    {children}
                </Nav>
                <div className={'d-flex pe-3'}>
                    <NavLink style={{color: "grey"}}>{currentUser.email}</NavLink>
                    {
                        currentUser.profileImage == null ?
                            <Avatar sx={{ width: 40, height: 40 }}/>
                            :
                            <Avatar src={currentUser.profileImage.url[0]} alt={'image'} sx={{ width: 40, height: 40 }}/>
                    }
                </div>
            </Bar.Collapse>
        </Bar>
    )
}