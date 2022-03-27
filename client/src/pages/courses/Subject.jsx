import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Icon } from "../../components/Sidebar/Item";

const toggleStyle = {
    cursor: 'pointer',
    userSelect: 'none'
}

const toggleOnClick = (val, setVal) => {
    if (val === 'none') setVal('block')
    else setVal('none')
}

export default function Subject({ title }) {
    const [display, setDisplay] = useState('none')
    return (
        <Card className={'mb-3 mt-3'}>
            <Card.Header className={'d-flex'} onClick={() => toggleOnClick(display, setDisplay)} style={toggleStyle}>
                <Icon iconClass={'bi-bookmark'}/>
                <Card.Text className={'ms-3'}>{title}</Card.Text>
            </Card.Header>
            <Card.Body className={`d-${display}`}>
                <Card.Text>
                    Subject 1
                </Card.Text>
            </Card.Body>
        </Card>
    )
}