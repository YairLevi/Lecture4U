import { Button, Card, Container, Modal, Navbar } from "react-bootstrap";
import Subject from './Subject'
import { useState } from "react";
import AddSubject from "./modals/AddSubject";
import requests from "../../helpers/requests";
import EditUnit from "./modals/EditUnit";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { useParams } from "react-router";


export default function Unit({ unitId, courseId, name, text, subjects, isTeacher }) {
    const [showAddSubject, setShowAddSubject] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const { id } = useParams()

    async function deleteUnit() {
        const res = await requests.delete('/course/unit', { unitId, courseId: id })
        return res.status === 200
    }

    return (
        <>
            <Card className={'mt-5 mb-5'}>
                <Card.Header className={'d-flex justify-content-between'}>
                    <Card.Title className={'p-1'}>{name}</Card.Title>
                    {
                        isTeacher &&
                        <div>
                            <Button variant={'outline-danger'} className={'me-2'} onClick={() => setOpenConfirm(true)}>Delete</Button>
                            <Button variant={"outline-dark"} className={'me-2'} onClick={() => setOpenEdit(true)}>Edit</Button>
                            <Button variant={'primary'} onClick={() => setShowAddSubject(true)}>Add Subject</Button>
                        </div>
                    }
                </Card.Header>
                <Card.Body>
                    {
                        text !== '' &&
                        <Card.Text style={{whiteSpace: 'pre-wrap'}} className={"mb-5"}>{text}</Card.Text>
                    }
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

            <ConfirmationModal show={openConfirm} onHide={() => setOpenConfirm(false)} text={`delete unit ${name}`} func={deleteUnit}/>
            <EditUnit name={name} text={text} id={unitId} show={openEdit} onHide={() => setOpenEdit(false)}/>
            <AddSubject show={showAddSubject} onHide={() => setShowAddSubject(false)} unitId={unitId}/>
        </>
    )
}