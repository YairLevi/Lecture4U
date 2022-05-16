import { useState } from "react";
import { Container } from "react-bootstrap";
import { Icon } from "../../components/Sidebar/Item";
import { useNav } from "../../contexts/NavContext";

export default function EditorTab({ name, docId }) {
    const [hover, setHover] = useState(false)
    const { relativeNav } = useNav()

    function handleClick() {
        relativeNav(`/document/${docId}`)
    }

    return (
        <Container className={'d-flex justify-content-between p-0'}
                   onMouseEnter={() => setHover(true)}
                   onMouseLeave={() => setHover(false)}
                   style={{ cursor: 'pointer' }}
                   onClick={handleClick}
        >
            <p style={{textOverflow: 'ellipsis', width: '90%'}}>{name}</p>
            <div style={{
                visibility: hover ? 'visible' : 'hidden',
            }}>
                <Icon iconClass={'bi-trash'}/>
            </div>
        </Container>
    )
}