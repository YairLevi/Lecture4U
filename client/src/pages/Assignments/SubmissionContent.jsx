import { Card } from "react-bootstrap";
import React from "react";


export default function SubmissionContent({ submissions }) {
    return (
        <>
            {
                submissions.map((value, index) => {
                    return (
                        <div key={index}>
                            {
                                value.userIds.map((user, index) => {
                                    return <div key={index} className={'d-flex justify-content-between'}>
                                        <h6 key={index}>
                                            {user.firstName} {user.lastName}
                                        </h6>
                                        <p className={'mb-2 ms-2 p-0'} style={{ fontSize: '0.9rem' }}>
                                            submission date: {new Date(value.date).parseEventDate()}
                                        </p>
                                    </div>
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
                        </div>
                    )
                })
            }
        </>
    )
}