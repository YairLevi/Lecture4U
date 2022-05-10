import React, { useEffect, useState } from 'react'
import { Container, Image } from 'react-bootstrap'
import Avatar from '@mui/material/Avatar';
import requests from "../helpers/requests";


export default function UserAvatar({ src, name, email, size }) {
    const [url, setUrl] = useState()

    // useEffect(() => {
    //     (async function() {
    //         const res = await requests.get('/profile/image')
    //         const json = await res.json()
    //         setUrl(json.url)
    //     })()
    // }, [])

    return (
        <Container className={'d-flex flex-column justify-content-center align-items-center p-0 ms-0'}>
            <Avatar src={url} alt={'https://picsum.photos/200'} sx={{ width: 40, height: 40 }}/>
        </Container>
    )
}