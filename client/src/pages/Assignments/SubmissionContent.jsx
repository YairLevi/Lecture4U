import { Button, Card, FormControl, Row, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import EditSubmission from "./modals/EditSubmission";
import UserLabel from "../../components/UserLabel";
import { useLoading } from "../../hooks/useLoading";
import requests from "../../helpers/requests";
import FileItem from "../../components/FileItem";


export default function SubmissionContent({ submission, assignmentId, asStudent }) {
    const [openEdit, setOpenEdit] = useState(false)
    const [grade, setGrade] = useState(submission.grade === -1 ? '' : submission.grade)
    const [loading, action] = useLoading(async () => {
        const res = await requests.post('/course/grade', { submissionId: submission._id, grade: parseInt(grade) })
        return res.status === 200
    })

    return (
        <>
            {
                <div>
                    {
                        submission.userIds.map((user, index) => {
                            return <div key={index} className={'d-flex justify-content-between'}>
                                <UserLabel {...user} noMargin={true} size={'small'}/>
                                <p className={'mb-2 ms-2 p-0'} style={{ fontSize: '0.9rem' }}>
                                    submission date: {new Date(submission.date).parseEventDate()}
                                </p>
                            </div>
                        })
                    }
                    <Card.Text style={{ whiteSpace: 'pre-wrap' }}>
                        {submission.text}
                    </Card.Text>
                    <Row>
                        {
                            submission.files.map((value, index) => (
                                <FileItem key={index} {...value} />
                            ))
                        }
                    </Row>
                </div>
            }
            <div className={'d-flex justify-content-between'}>
                <div>
                    {
                        asStudent &&
                        <Button className={'mt-5'} onClick={() => setOpenEdit(true)}>Edit</Button>
                    }
                </div>
                <div className={'mt-auto d-flex justify-content-end align-items-center'}>
                    {
                        !asStudent ?
                            <>
                                Give Grade:<FormControl value={grade} className={'w-25 ms-2'}
                                                        onChange={e => setGrade(e.target.value)}/>
                                <Button className={'ms-2'} onClick={action}>
                                    {loading && <Spinner animation={'border'}/>}
                                    Post
                                </Button>
                            </> :
                            <>
                                Grade: {
                                submission.grade === -1 ?
                                    <>Not Given Yet</> :
                                    <>{submission.grade}</>
                            }
                            </>
                    }
                </div>
            </div>

            <EditSubmission show={openEdit}
                            onHide={() => setOpenEdit(false)}
                            assignmentId={assignmentId}
                            {...submission}
            />
        </>
    )
}