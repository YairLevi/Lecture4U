import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbars/Navbar";
import Hero from './Hero'
import Hero2 from "./Hero2";
import Hero3 from "./Hero3";
import HomeBottom from "./Bottom";
import About from "./About";
import Contact from './Contact'
import { useLocation } from "react-router";


export default function Home(props) {
    const location = useLocation()

    return (
        <div className={"d-flex flex-column justify-content-center"}>
            <Navbar/>
            {location.hash === '#about' ? <About/> :
                location.hash === '#contact' ? <Contact/>:
                    <>
                        <Hero/>
                        <Hero2/>
                        <Hero3/>
                    </>
            }
            <HomeBottom/>
        </div>
    )
}