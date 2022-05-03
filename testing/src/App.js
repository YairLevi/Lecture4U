import React, { useEffect, useState } from "react";
import { Container, Card } from 'react-bootstrap'
import {
    useSearchParams,
    useParams,
    useNavigate,
    Route,
    Routes
} from 'react-router-dom'


export function Page() {
    let { id } = useParams()

    return (
        <Container>
            the id is {id}
            {/*<button onClick={() => id=3}>click</button>*/}
        </Container>
    )
}

export default function App() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    return (
        <Container>
            <p>Click on one of the buttons to change page</p>
            <button onClick={() => {
                navigate('/page')
            }}>go to /page</button>
            <button onClick={() => {
                navigate({
                    pathname: '/home',
                    search: '?'
                })
            }}>go to /home</button>
            <button onClick={() => {
                setSearchParams({ p : 1, p2: 2 })
            }}>add param p</button>
            <Routes>
                <Route path={'/page'} element={
                    <p>this is the page</p>
                }/>
                <Route path={'/home'} element={
                    <p>this is the home</p>
                }/>
            </Routes>
        </Container>
    );
}