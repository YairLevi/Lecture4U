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
            <h3 className={'p-1 mt-5 mb-2'}>{name}</h3>
            <Card className={'mb-5'} style={{ backgroundColor: '#fbfbfb' }}>
                <Card.Body>
                    <div className={'d-flex justify-content-between'}>
                        {
                            text !== '' &&
                            <Card.Text style={{whiteSpace: 'pre-wrap'}} className={"mb-5 ms-2"}>{text}</Card.Text>
                        }
                        {
                            isTeacher &&
                            <div>
                                <Button variant={'outline-danger'} className={'me-2 border-0'} onClick={() => setOpenConfirm(true)}>Delete</Button>
                                <Button variant={"outline-dark"} className={'me-2 border-0'} onClick={() => setOpenEdit(true)}>Edit</Button>
                                <Button variant={'primary'} onClick={() => setShowAddSubject(true)}>Add Subject</Button>
                            </div>
                        }
                    </div>

                    {subjects && subjects.map((value, index) => {
                        return <Subject key={index}
                                        unitId={unitId}
                                        subjectId={value._id}
                            {...value}

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