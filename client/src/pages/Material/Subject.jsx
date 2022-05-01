import { useState } from "react";
import { Card, NavLink } from "react-bootstrap";
import { Icon } from "../../components/Sidebar/Item";

const toggleStyle = {
    cursor: 'pointer',
    userSelect: 'none'
}

const toggleOnClick = (val, setVal) => {
    if (val === 'none') setVal('block')
    else setVal('none')
}

export default function Subject({ subjectId, name, text, files }) {
    const [display, setDisplay] = useState('none')

    return (
        <Card className={'mb-3 mt-3'}>
            <Card.Header className={'d-flex'} onClick={() => toggleOnClick(display, setDisplay)} style={toggleStyle}>
                <Icon iconClass={'bi-bookmark'}/>
                <Card.Text as={'h5'} className={'ms-3'}>{name}</Card.Text>
            </Card.Header>
            <Card.Body className={`d-${display}`}>
                <Card.Text>{text}</Card.Text>
                {
                    files && files.map((value, index) => (
                         <div key={index} >
                            <a href={value.url}>{value.name}</a>
                        </div>
                    ))
                }
            </Card.Body>
        </Card>
    )
}