import { Button, Card } from "react-bootstrap";
import React, { useState } from "react";
import EditSubmission from "./modals/EditSubmission";


export default function SubmissionContent({ submissions, assignmentId }) {
    const [openEdit, setOpenEdit] = useState(false)

    return (
        <>
            {
                submissions.length !== 0 && <div>
                    {
                        submissions[0].userIds.map((user, index) => {
                            return <div key={index} className={'d-flex justify-content-between'}>
                                <h6 key={index}>
                                    {user.firstName} {user.lastName}
                                </h6>
                                <p className={'mb-2 ms-2 p-0'} style={{ fontSize: '0.9rem' }}>
                                    submission date: {new Date(submissions[0].date).parseEventDate()}
                                </p>
                            </div>
                        })
                    }
                    <Card.Text>
                        {submissions[0].text}
                    </Card.Text>
                    {
                        submissions[0].files.map((value, index) => (
                            <div key={index}>
                                <a href={value.url}>{value.name}</a>
                            </div>
                        ))
                    }
                </div>
            }
            <Button className={'mt-5'} onClick={() => setOpenEdit(true)}>Edit</Button>
            <Button className={'mt-5 ms-2'} variant={'outline-danger'}>Delete</Button>

            <EditSubmission show={openEdit}
                            onHide={() => setOpenEdit(false)}
                            assignmentId={assignmentId}
                            {...submissions[0]}
            />
        </>
    )
}