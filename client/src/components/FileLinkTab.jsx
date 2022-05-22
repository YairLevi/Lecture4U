import { Container, Button } from 'react-bootstrap'
import { Icon } from "./Sidebar/Item";
import { useState } from "react";


export default function FileLinkTab({ name, link, onClick }) {
    const [hover, setHover] = useState(false)

    return (
        <Container className={'d-flex justify-content-between p-0'}
                   onMouseEnter={() => setHover(true)}
                   onMouseLeave={() => setHover(false)}
                   // style={{ cursor: 'pointer' }}
        >
            <a style={{width: 'fit-content'}} href={link}>{name}</a>
            <div style={{
                cursor: 'pointer',
                visibility: hover ? 'visible' : 'hidden',
            }} onClick={onClick}>
                <Icon iconClass={'bi-trash'}/>
            </div>
        </Container>
    )
}