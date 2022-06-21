import { Button, Card, FormControl, Row, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import EditSubmission from "./modals/EditSubmission";
import UserLabel from "../../components/UserLabel";
import { useLoading } from "../../hooks/useLoading";
import requests from "../../helpers/requests";
import FileItem from "../../components/FileItem";


export default function SubmissionContent({ submissions, assignmentId, asStudent }) {
    const [openEdit, setOpenEdit] = useState(false)
    const [grade, setGrade] = useState(submissions[0].grade === -1 ? '' : submissions[0].grade)
    const [loading, action] = useLoading(async () => {
        const res = await requests.post('/course/grade', { submissionId: submissions[0]._id, grade: parseInt(grade) })
        return res.status === 200
    })

    return (
        <>
            {
                submissions.length !== 0 && <div>
                    {
                        submissions[0].userIds.map((user, index) => {
                            return <div key={index} className={'d-flex justify-content-between'}>
                                <UserLabel {...user} noMargin={true} size={'small'}/>
                                <p className={'mb-2 ms-2 p-0'} style={{ fontSize: '0.9rem' }}>
                                    submission date: {new Date(submissions[0].date).parseEventDate()}
                                </p>
                            </div>
                        })
                    }
                    <Card.Text style={{ whiteSpace: 'pre-wrap' }}>
                        {submissions[0].text}
                    </Card.Text>
                    <Row>
                        {
                            submissions[0].files.map((value, index) => (
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
                                submissions[0].grade === -1 ?
                                    <>Not Given Yet</> :
                                    <>{submissions[0].grade}</>
                            }
                            </>
                    }
                </div>
            </div>

            <EditSubmission show={openEdit}
                            onHide={() => setOpenEdit(false)}
                            assignmentId={assignmentId}
                            {...submissions[0]}
            />
        </>
    )
}