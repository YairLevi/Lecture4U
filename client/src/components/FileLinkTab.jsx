import { Container, Button } from 'react-bootstrap'
import { Icon } from "./Sidebar/Item";
import { useState } from "react";
import DeleteButton from "./DeleteButton";


export default function FileLinkTab({ name, link, onClick }) {
    const [hover, setHover] = useState(false)

    return (
        <Container className={'d-flex justify-content-between p-0'}
                   onMouseEnter={() => setHover(true)}
                   onMouseLeave={() => setHover(false)}
                   // style={{ cursor: 'pointer' }}
        >
            <a style={{width: 'fit-content'}} href={link}>{name}</a>
            <DeleteButton onClick={onClick} fontSize={'1.2rem'}/>
        </Container>
    )
}