import { Container, Button } from 'react-bootstrap'
import { Icon } from "../components/Sidebar/Item";
import { useState } from "react";


export default function FileTab({ name, onClick }) {
    const [hover, setHover] = useState(false)

    return (
        <Container className={'d-flex justify-content-between p-0'}
                   onMouseEnter={() => setHover(true)}
                   onMouseLeave={() => setHover(false)}
                   style={{ cursor: 'pointer' }}
                   onClick={onClick}
        >
            <p style={{textOverflow: 'ellipsis'}}>{name}</p>
            <div style={{
                visibility: hover ? 'visible' : 'hidden',
            }}>
                <Icon iconClass={'bi-trash'}/>
            </div>
        </Container>
    )
}