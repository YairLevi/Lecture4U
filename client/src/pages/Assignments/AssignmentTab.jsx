import { useState } from "react";
import { Card, NavLink, Button } from "react-bootstrap";
import { Icon } from "../../components/Sidebar/Item";
import SubmitAssignment from "./modals/SubmitAssignment";

const toggleStyle = {
    cursor: 'pointer',
    userSelect: 'none'
}

const toggleOnClick = (val, setVal) => {
    if (val === 'none') setVal('block')
    else setVal('none')
}

export default function AssignmentTab({ id, name, text, files, dueDate, submissions }) {
    const [display, setDisplay] = useState('none')
    const [openSubmit, setOpenSubmit] = useState(false)

    return (
        <>
            <Card className={'mb-3 mt-3'}>
                <Card.Header className={'d-flex'} onClick={() => toggleOnClick(display, setDisplay)}
                             style={toggleStyle}>
                    <Icon iconClass={'bi-bookmark'}/>
                    <Card.Text as={'h5'} className={'ms-3'}>{name}</Card.Text>
                    <Card.Text>{dueDate}</Card.Text>
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
                    <Button className={'mt-3'} onClick={() => setOpenSubmit(true)}>Submit</Button>
                    {
                        submissions.map((value, index) => {
                            return <Card className={'mt-3'} key={index}>
                                <Card.Body>
                                    {
                                        value.userIds.map((value, index) => {
                                            return <Card.Text key={index}>
                                                {value.firstName} {value.lastName}
                                            </Card.Text>
                                        })
                                    }
                                    <Card.Text>
                                        {value.text}
                                    </Card.Text>
                                    {
                                        value.files && value.files.map((value, index) => (
                                            <div key={index}>
                                                <a href={value.url}>{value.name}</a>
                                            </div>
                                        ))
                                    }
                                    <Card.Text>
                                        {value.date}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        })
                    }
                </Card.Body>
            </Card>

            <SubmitAssignment show={openSubmit} onHide={() => setOpenSubmit(false)} assignmentId={id}/>
        </>
    )
}