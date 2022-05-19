import { Button, Card, Container, Navbar } from "react-bootstrap";
import Subject from './Subject'
import { useState } from "react";
import AddSubject from "./modals/AddSubject";
import requests from "../../helpers/requests";


export default function Unit({ unitId, courseId, name, text, subjects, isTeacher }) {
    const [showAddSubject, setShowAddSubject] = useState(false)

    return (
        <>
            <Card className={'mt-5 mb-5'}>
                <Card.Header className={'d-flex justify-content-between'}>
                    <Card.Title className={'p-1'}>{name}</Card.Title>
                    {
                        isTeacher &&
                        <div>
                            <Button variant={'outline-danger'} className={'me-2'}>Delete</Button>
                            <Button variant={"outline-dark"} className={'me-2'}>Edit</Button>
                            <Button variant={'primary'} onClick={() => setShowAddSubject(true)}>Add Subject</Button>
                        </div>
                    }
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

            <AddSubject centered show={showAddSubject} onHide={() => setShowAddSubject(false)} unitId={unitId}/>
        </>
    )
}