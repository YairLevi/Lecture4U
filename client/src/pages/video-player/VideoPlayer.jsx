import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { Container, Button } from 'react-bootstrap'


export default function Player() {
    const [path, setPath] = useState(null)

    async function getVideo() {
        const fileURI = 'http://localhost:8000/video'
        const res = await fetch(fileURI, {credentials: 'include'})
        const url = (await res.json()).url
        setPath(url)
        console.log(path)
    }

    useEffect(() => {getVideo()}, [])

    return (
        <Container>
            <ReactPlayer
                controls
                width={1024}
                height={580}
                url={path}
            />
        </Container>
    )
}