import React, { useState } from 'react'
import { DashboardSidebar } from "./Sidebar";
import { Button } from 'react-bootstrap'
import Navbar from "../../components/Navbar";
import YES from "../../components/tempSidebar";


export default function Main() {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Navbar onOpen={() => setOpen(true)}/>
            <YES onClose={() => setOpen(false)} open={open}/>
        </>
    )
}