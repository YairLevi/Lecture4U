import React from 'react';
import Navbar from "../../components/Navbar";
import Hero from './Hero'
import { Container } from 'react-bootstrap'


export default function Home(props) {
    return (
        <div className={"d-flex flex-column justify-content-center"}>
            <Navbar/>
            <Hero/>
        </div>
    )
}