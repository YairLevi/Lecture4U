import { Button, Card, Navbar } from "react-bootstrap";
import Subject from './Subject'
import { useState } from "react";
import AddSubject from "../../modals/AddSubject";
import requests from "../../helpers/requests";


export default function Unit({ unitId, courseId, name, text, subjects, isStudent }) {
    const [showAddSubject, setShowAddSubject] = useState(false)

    return (
        <>
            <Card className={'mt-5 mb-5'}>
                <Card.Header className={'d-flex justify-content-between'}>
                    <Card.Title>{name}</Card.Title>
                    { isStudent && <Button variant={'primary'} onClick={() => setShowAddSubject(true)}>Add Subject</Button> }
                </Card.Header>
                <Card.Body>
                    <Card.Text>{text}</Card.Text>
                    {subjects && subjects.map((value, index) => {
                        return <Subject key={index}
                                        unitId={unitId}
                                        subjectId={value._id}
                                        name={value.name}
                                        text={value.text}
                                        files={value.files}
                        />
                    })}
                </Card.Body>
            </Card>

            <AddSubject centered show={showAddSubject} onHide={() => setShowAddSubject(false)} unitId={unitId} />
        </>
    )
}