import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from "./pages/home/Home";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Main from "./pages/main/Main";
import AuthProvider from "./components/AuthContext";
import { PublicRoute, PrivateRoute } from "./components/Routes";
import { useAuth } from "./components/AuthContext";
import { Spinner, Container } from "react-bootstrap";

function App() {
    const { isLoggedIn } = useAuth()

    return isLoggedIn === null ? (
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner animation='grow'/>
        </Container>
    ) : (
        <Router>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route element={<PublicRoute/>}>
                    <Route path={"/sign-up"} element={<SignUp/>}/>
                    <Route path={"/sign-in"} element={<SignIn/>}/>
                </Route>
                <Route element={<PrivateRoute/>}>
                    <Route path={"/main/*"} element={<Main/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;