import React from 'react';
import Navbar from "../../components/Navbars/Navbar";
import Hero from './Hero'
import { Container } from 'react-bootstrap'
import image1 from '../../assets/default-course-img-1.PNG'


export default function Home(props) {
    return (
        <div className={"d-flex flex-column justify-content-center"}>
            <Navbar/>
            <Hero/>
            <Hero/>
            <Hero/>
        </div>
    )
}