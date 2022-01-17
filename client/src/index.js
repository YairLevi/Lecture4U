import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/home/Home";
import SignInPage from "./pages/SignIn/SignInPage";

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
