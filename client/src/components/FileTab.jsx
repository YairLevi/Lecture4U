import { Container, Button } from 'react-bootstrap'
import { Icon } from "./Sidebar/Item";
import { useState } from "react";


export default function FileTab({ name, onClick }) {
    const [hover, setHover] = useState(false)

    return (
        <Container className={'d-flex justify-content-between p-0'}
                   onMouseEnter={() => setHover(true)}
                   onMouseLeave={() => setHover(false)}
                   style={{ cursor: 'pointer' }}
        >
            <p style={{textOverflow: 'ellipsis', width: '90%'}}>{name}</p>
            <div style={{
                visibility: hover ? 'visible' : 'hidden',
            }} onClick={onClick}>
                <Icon iconClass={'bi-trash'}/>
            </div>
        </Container>
    )
}