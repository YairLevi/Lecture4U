import React, { useState } from 'react'
import { Button, Card, Container } from "react-bootstrap";
import SubmitAssignment from "./modals/SubmitAssignment";
import AssignmentContent from "./AssignmentContent";
import SubmissionContent from "./SubmissionContent";


const dueDateColor = '#007bff'
const dueDateTextColor = 'white'

export default function AssignmentTab({ id, name, text, files, number, dueDate, createdAt, submissions, children}) {
    const [show, setShow] = useState(false)
    const [openSubmit, setOpenSubmit] = useState(false)

    return (
        <div className={'mt-4 overflow-hidden border border-1'} style={{
            borderRadius: '10px',
            marginLeft: 'auto',
            marginRight: 'auto',
        }}>
            <div className={'d-flex'} onClick={() => setShow(prev => !prev)}>
                <Container className={'col-3 pt-1 pb-2 ps-2 pe-2'} style={{
                    backgroundColor: dueDateColor,
                    color: dueDateTextColor,
                    userSelect: 'none',
                    cursor: 'pointer',
                }}>
                    <h6 className={'m-1 mt-2 mb-0 mt-1'}>Due Date: {new Date(dueDate).getMonthAndDay()}</h6>
                    <span className={'m-1 pb-3'}
                          style={{ fontSize: '0.8rem' }}>created at: {createdAt ? new Date(createdAt).getMonthAndDay() : 'No Creation Date'}</span>
                </Container>
                <Container className={'d-flex justify-content-between col-9 p-2 border-bottom border-1'} style={{
                    userSelect: 'none',
                    cursor: 'pointer',
                }}>
                    <div>
                        <h6 className={'m-0 mb-0 ms-2'} style={{ color: 'gray' }}>Exercise {number ? number : 0}</h6>
                        <h5 className={'m-1 ms-2'} style={{ width: '20ch' }}>{name}</h5>
                    </div>
                    <i style={{ fontSize: '2rem' }} className={`bx bx-chevron-${show ? 'down' : 'right'}`} />
                </Container>
            </div>
            <Card className={'border-0 rounded-0'} style={{ display: show ? 'block' : 'none', }}>
                <Card.Body>
                    {children}
                </Card.Body>
            </Card>

            <SubmitAssignment show={openSubmit} onHide={() => setOpenSubmit(false)} assignmentId={id}/>
        </div>
    )
}