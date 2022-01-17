import React from 'react';
import {Container} from "react-bootstrap";

import '../styles/FormStyle.css'


export default function SignUpPage(props) {
    return (
        <Container className={
            "bg-opacity-75 bg-primary mw-100 vh-100 " +
            "d-flex justify-content-center align-items-center"
        }>
            <form className={"bg-light p-5 w-25"} style={{borderRadius: 15}}>
                <h3 className={"text-center"}>Sign Up</h3>

                <div className="mb-3">
                    <label className={"form-label"}>First name</label>
                    <input type="text" className="form-control" placeholder="First name"/>
                </div>

                <div className="form-group mb-3">
                    <label className={"form-label"}>Last name</label>
                    <input type="text" className="form-control" placeholder="Last name"/>
                </div>

                <div className="form-group mb-3">
                    <label className={"form-label"}>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email"/>
                </div>

                <div className="form-group mb-3">
                    <label className={"form-label"}>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password"/>
                </div>

                <div className="col text-center">
                    <button type="submit" className="btn btn-primary btn-block mb-3">Sign Up</button>
                </div>

                <p className="forgot-password text-right">
                    Already registered? <a href="#">Sign in</a>
                </p>
            </form>
        </Container>
    )
}