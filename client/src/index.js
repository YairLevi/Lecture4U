import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthProvider from "./components/AuthContext";
import CourseProvider from "./components/CourseContext";
import { BrowserRouter } from 'react-router-dom'
import NavProvider from "./hooks/NavContext";


ReactDOM.render(
    <BrowserRouter>
        <NavProvider>
            <AuthProvider>
                <CourseProvider>
                    <App/>
                </CourseProvider>
            </AuthProvider>
        </NavProvider>
    </BrowserRouter>,
    document.getElementById('root'));
