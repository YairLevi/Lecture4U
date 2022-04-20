import React, { useState } from "react";
import { Navbar as Bar, Button, Form, Nav } from "react-bootstrap";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import UserAvatar from "./Avatar";
import { Avatar } from "@mui/material";


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
    return (
        <Bar className={"p-3"} bg={"white"} expand="xl" sticky={isSticky}>
            <SideButton breakpoint={'lg'} onClick={openSidebar}/>
            <Bar.Brand href="/">
                <h4>Lecture4U</h4>
            </Bar.Brand>
            {/*<Nav variant="pills">*/}
            {/*    <Nav.Item>*/}
            {/*        <Nav.Link href="/home">Active</Nav.Link>*/}
            {/*    </Nav.Item>*/}
            {/*    <Nav.Item>*/}
            {/*        <Nav.Link eventKey="link-1">Option 2</Nav.Link>*/}
            {/*    </Nav.Item>*/}
            {/*    <Nav.Item>*/}
            {/*        <Nav.Link eventKey="disabled" disabled>*/}
            {/*            Disabled*/}
            {/*        </Nav.Link>*/}
            {/*    </Nav.Item>*/}
            {/*</Nav>*/}
            <Nav variant={'pills'}>
                {children}
            </Nav>
        </Bar>
    )
}