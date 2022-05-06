import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthProvider from "./contexts/AuthContext";
import { BrowserRouter } from 'react-router-dom'
import NavProvider from "./hooks/NavContext";


ReactDOM.render(
    <BrowserRouter>
        <NavProvider>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </NavProvider>
    </BrowserRouter>,
    document.getElementById('root'));
