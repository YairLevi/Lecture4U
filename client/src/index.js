import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthProvider from "./components/AuthContext";
import CourseProvider from "./components/CourseContext";
import { BrowserRouter } from 'react-router-dom'



ReactDOM.render(
    <BrowserRouter>
        <AuthProvider>
            <CourseProvider>
                <App/>
            </CourseProvider>
        </AuthProvider>
    </BrowserRouter>,
document.getElementById('root')
)
;
