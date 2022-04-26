import { Container, Spinner } from 'react-bootstrap'
import ForumSidebar from "./ForumSidebar";
import ForumDiscussion from "./ForumDiscussion";
import NewDiscussion from "../../modals/NewDiscussion";
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import { useLocation } from "react-router-dom";
import { useCourse } from "../../components/CourseContext";


export default function ForumPage() {
    const [currentDiscussion, setCurrentDiscussion] = useState(null)
    const [discussions, setDiscussions] = useState(null)
    const [loading, setLoading] = useState(false)
    const { course } = useCourse()
    const location = useLocation()


    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const res = await requests.get('/forum/data', { courseId: course })
            const data = await res.json()
            setDiscussions(data)
            const params = requests.parseParams(location)
            const discussion = data.find(d => d._id === params.forumId)
            setCurrentDiscussion(discussion)
            setLoading(false)
        }
        fetchData()
    }, [])

    async function addDiscussion(title, question) {
        const res = await requests.post('/forum/create/discussion', { title, question },
            { courseId: course })
        const discussion = await res.json()
        setDiscussions(prevDis => [...prevDis, discussion])
    }

    return (
        loading ?
            <Container className={'d-flex justify-content-center align-items-center'}>
                <Spinner className={'m-3'} animation="border"/>
            </Container> :
            <Container fluid className={'h-100 d-flex p-0'}>
                <ForumSidebar setCurrentDiscussion={setCurrentDiscussion}
                              addDiscussion={addDiscussion}
                              discussions={discussions}/>
                <ForumDiscussion currentDiscussion={currentDiscussion}/>
            </Container>
    )
}