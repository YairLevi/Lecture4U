import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { Container, Button } from 'react-bootstrap'


export default function Player() {
    const fileURI = 'http://localhost:8000/video'

    return (
        <Container>
            <ReactPlayer
                controls
                width={1024}
                height={580}
                url={fileURI}
            />
        </Container>
    )
}