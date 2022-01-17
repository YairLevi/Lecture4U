import React from 'react';
import {Container} from 'react-bootstrap';

import '../styles/FormStyle.css'


export default function SignInPage(props) {
    return (
        <Container className={
            "bg-opacity-75 bg-primary mw-100 vh-100 " +
            "d-flex justify-content-center align-items-center"
        }>
            <form className={"bg-light p-5 w-25"} style={{borderRadius: 15}}>
                <h3 className={"text-center"}>Sign In</h3>

                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1"/>
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Remember Me</label>
                </div>
                <div className={"col text-center"}>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </Container>
    );
}