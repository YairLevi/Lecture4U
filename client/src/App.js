import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Link, Route, BrowserRouter} from "react-router-dom";
import React from "react";

import Home from "./pages/home/Home";
import SignInPage from "./pages/SignIn/SignInPage";
import SignUpPage from "./pages/SignUp/SignUpPage";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"}
                       element={<Home/>}/>

                <Route path={"/sign-in"}
                       element={<SignInPage/>}/>

                <Route path={"/sign-up"}
                       element={<SignUpPage/>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;