import React from 'react';
import NavbarComp from "../components/Navbar";
import SignIn from "../components/forms/Sign-in";

const Home = () => {
    return (
        <div className={"m-auto d-flex flex-column justify-content-center"}>
            <NavbarComp/>
            <SignIn/>
        </div>
    );
};

export default Home;