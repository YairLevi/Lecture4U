import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons/css/boxicons.min.css'
import './App.css';

import Home from "./pages/Home/Home";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import Main from "./pages/main/Main";
import AuthProvider from "./contexts/AuthContext";
import { PublicRoute, PrivateRoute } from "./components/Routes";
import { useAuth } from "./contexts/AuthContext";
import { Spinner, Container } from "react-bootstrap";
import SecurityCode from "./pages/Authentication/SecurityCode";
import EnterMail from "./pages/Authentication/EnterMail";
import ResetPassword from "./pages/Authentication/ResetPassword";
import './helpers/prototypeFunctions'
import About from "./pages/Home/About";

function App() {
    const { loading } = useAuth()

    return loading ? (
        <Container className={'d-flex vh-100 justify-content-center align-items-center'}>
            <Spinner animation='grow'/>
        </Container>
    ) : (
        <Routes>
            <Route path={"/"} exact element={<Home/>}/>
            <Route path={"/sign-up"} element={<SignUp/>}/>
            <Route path={'/reset-password'} element={<EnterMail/>} />
            <Route path={'/reset-password/code'} element={<SecurityCode/>} />
            <Route path={'/reset-password/new'} element={<ResetPassword/>} />
            <Route element={<PublicRoute/>}>
                <Route path={"/sign-in"} element={<SignIn/>}/>
            </Route>
            <Route element={<PrivateRoute/>}>
                <Route path={"/*"} element={<Main/>}/>
            </Route>
        </Routes>
    );
}

export default App;