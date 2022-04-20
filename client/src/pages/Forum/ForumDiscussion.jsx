import { Container, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from 'react';
import ForumSubject from "./Forum.discussion/ForumSubject";
import ForumComment from "./Forum.discussion/ForumComment";
import ForumTextbox from "./Forum.discussion/ForumTextbox";
import requests from "../../helpers/requests";


export default function ForumDiscussion({ currentDiscussion }) {
    const [comments, setComments] = useState(null)

    useEffect(() => {
        async function fetchData() {
            if (!currentDiscussion) return
            const res = await requests.get('/forum/comments', { discussionId: currentDiscussion.id })
            const json = await res.json()
            setComments(json)
        }

        fetchData()
    }, [currentDiscussion])

    return (
        <Container fluid className={'w-100 h-100 overflow-auto border-start'}>
            {!currentDiscussion ? <h1>No Discussion Selected</h1> :
                <>
                    <ForumSubject title={currentDiscussion.title}
                                  author={currentDiscussion.author}
                                  content={currentDiscussion.content}
                                  createdAt={currentDiscussion.createdAt}
                    />
                    <ForumTextbox currentDiscussion={currentDiscussion}/>
                    {
                        !comments
                            ?
                            <Container className={'d-flex justify-content-center align-items-center'}>
                                <Spinner className={'m-3'} animation="border"/>
                            </Container>
                            :
                            comments.map((value, index) => {
                                const name = value.author.firstName + ' ' + value.author.lastName
                                return <ForumComment key={index} name={name} content={value.content}/>
                            })
                    }
                </>
            }
        </Container>
    )
}