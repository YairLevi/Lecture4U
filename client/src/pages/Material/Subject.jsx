import { useState } from "react";
import { Button, Card, NavLink } from "react-bootstrap";
import { Icon } from "../../components/Sidebar/Item";
import useLocalStorage from "../../hooks/useLocalStorage";

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
    const [state, ] = useLocalStorage('state')
    const isTeacher = state === 'teacher'

    return (
        <Card className={'mb-3 mt-3'}>
            <Card.Header className={'d-flex justify-content-between'} onClick={() => toggleOnClick(display, setDisplay)} style={toggleStyle}>
                <div className={'d-flex align-items-center'}>
                    <Icon iconClass={'bi-bookmark'}/>
                    <Card.Text as={'h5'} className={'ms-3'}>{name}</Card.Text>
                </div>
                {
                    isTeacher &&
                    <div>
                        <Button className={'me-2'} variant={'outline-danger'}>Delete</Button>
                        <Button variant={"outline-dark"}>Edit</Button>
                    </div>
                }
            </Card.Header>
            <Card.Body className={`d-${display}`}>
                <Card.Text>{text}</Card.Text>
                {
                    files && files.map((value, index) => (
                        <div key={index}>
                            <a href={value.url}>{value.name}</a>
                        </div>
                    ))
                }
            </Card.Body>
        </Card>
    )
}