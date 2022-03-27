import { Button, Card, Navbar } from "react-bootstrap";
import Subject from './Subject'
import { useState } from "react";
import AddSubject from "../../modals/AddSubject";

export default function Unit({ name, text, subjects }) {
    const [showAddSubject, setShowAddSubject] = useState(false)


    return (
        <>
        <Card className={'mt-5 mb-5'}>
            <Card.Header className={'d-flex justify-content-between'}>
                <Card.Title>{name}</Card.Title>
                <Button variant={'primary'} onClick={() => setShowAddSubject(true)}>Add Subject</Button>
            </Card.Header>
            <Card.Body>
                <Card.Text>{text}</Card.Text>
                {subjects && subjects.map(value => <Subject title={'lecture 1'}/>)}
            </Card.Body>
        </Card>

            <AddSubject centered show={showAddSubject} onHide={() => setShowAddSubject(false)}/>
        </>
    )
}