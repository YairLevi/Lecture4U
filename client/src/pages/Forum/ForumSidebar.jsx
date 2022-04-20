import { Container, Spinner } from 'react-bootstrap'
import React, { useEffect } from 'react'
import ForumTab from "./ForumTab";
import ForumTopBar from "./ForumTopBar";
import NewDiscussion from "../../modals/NewDiscussion";
import { useState } from "react";
import requests from "../../helpers/requests";
import { useCourse } from "../../components/CourseContext";


function getStringDate(d) {
    const date = new Date(d)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
}

export default function ForumSidebar({ setCurrentDiscussion }) {
    const [openNewDiscussion, setOpenNewDiscussion] = useState(false)
    const [discussions, setDiscussions] = useState(null)
    const { course } = useCourse()

    useEffect(() => {
        async function fetchData() {
            const res = await requests.get('/forum/data', { courseId: course })
            const data = await res.json()
            setDiscussions(data)
        }

        fetchData()
    }, [])

    return (
        <>
            <Container className={'d-flex flex-column h-100'} style={{
                width: '500px'
            }}>
                <ForumTopBar onClick={() => setOpenNewDiscussion(true)}/>
                <Container fluid className={'h-100 overflow-auto p-0 me-2'}>
                    {
                        !discussions
                            ?
                            <Container className={'d-flex justify-content-center align-items-center'}>
                                <Spinner className={'m-3'} animation="border"/>
                            </Container>
                            :
                            discussions.map((value, index) => {
                                const createdAt = getStringDate(value.createdAt)
                                const mostRecent = getStringDate(value.mostRecent)
                                return <ForumTab key={index}
                                                 value={{
                                                     id: value._id,
                                                     author: value.author,
                                                     createdAt: createdAt,
                                                     mostRecent: mostRecent,
                                                     title: value.title,
                                                     question: value.question
                                                 }}
                                                 setCurrentDiscussion={setCurrentDiscussion}
                                />
                            })
                    }
                </Container>
            </Container>

            <NewDiscussion centered show={openNewDiscussion} onHide={() => setOpenNewDiscussion(false)}/>
        </>
    )
}