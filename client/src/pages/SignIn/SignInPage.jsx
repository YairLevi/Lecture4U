import React from 'react';
import {Container} from 'react-bootstrap';

import '../styles/FormStyle.css'

const protocol = 'http'
const host = 'localhost'
const PORT = '8000'

function createUrl(params) {
    let a = `${protocol}://${host}:${PORT}/users/isUser/?`
    for (let key of Object.keys(params))
        a += `${key}=${params[key]}&`
    return a
}

async function auth(email, password) {
    const params = {email:email, password:password}
    const url = createUrl(params)
    console.log(url)
    const result = await fetch(url)
    console.log(result)
    if (result.isUser) console.log('Connected Successfully')
    else console.log('Wrong user or password')
}


export default function SignInPage(props) {
    const [mail, setMail] = React.useState('')
    const [password, setPassword] = React.useState('')

    return (
        <Container className={
            "bg-opacity-75 bg-primary mw-100 vh-100 " +
            "d-flex justify-content-center align-items-center"
        }>
            <form className={"bg-light p-5 w-25"} style={{borderRadius: 15}}>
                <h3 className={"text-center"}>Sign In</h3>

                <div className="mb-3">
                    <label htmlFor="mail" className="form-label">Email address</label>
                    <input type="email" onChange={event => setMail(event.target.value)}
                           className="form-control" id="mail" aria-describedby="emailHelp"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" onChange={event => setPassword(event.target.value)}
                           className="form-control" id="password"/>
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Remember Me</label>
                </div>
                <div className={"col text-center"}>
                    <button type="submit" onClick={() => auth(mail, password)} className="btn btn-primary">Submit</button>
                </div>
                <p className="forgot-password text-right">
                    <a href={"forgot-password"}>Forgot Password?</a>
                </p>
            </form>
        </Container>
    );
}