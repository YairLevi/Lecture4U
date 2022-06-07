import { useState } from "react";
import { Container } from "react-bootstrap";
import { Icon } from "../../components/Sidebar/Item";
import { useNav } from "../../contexts/NavContext";
import DeleteButton from "../../components/DeleteButton";

export default function EditorTab({ name, docId, onClick }) {
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
            <DeleteButton onClick={onClick} fontSize={'1.2rem'} />
        </Container>
    )
}