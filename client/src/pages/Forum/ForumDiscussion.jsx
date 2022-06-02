import { Container, Spinner } from "react-bootstrap";
import React, { useCallback, useEffect, useState } from 'react';
import ForumSubject from "./Forum.discussion/ForumSubject";
import ForumComment from "./Forum.discussion/ForumComment";
import ForumTextbox from "./Forum.discussion/ForumTextbox";
import requests from "../../helpers/requests";
import { useSearchParams } from "react-router-dom";


export default function ForumDiscussion({ currentDiscussion }) {
    const [comments, setComments] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

    async function fetchData() {
        if (!currentDiscussion) return
        setComments([])
        setLoading(true)
        const res = await requests.get('/forum/comments', { discussionId: currentDiscussion._id })
        const json = await res.json()
        setComments(json)
        setLoading(false)
    }

    useEffect(() => fetchData(), [currentDiscussion, searchParams])

    return (
        <Container fluid className={'w-100 h-100 overflow-auto border-start'}>
            {!currentDiscussion ? <h1>No Discussion Selected</h1> :
                <>
                    <ForumSubject title={currentDiscussion.title}
                                  author={currentDiscussion.author}
                                  content={currentDiscussion.content}
                                  createdAt={currentDiscussion.createdAt}
                    />
                    <ForumTextbox currentDiscussion={currentDiscussion} refresh={() => fetchData()}/>
                    {
                        loading &&
                        <Container className={'d-flex justify-content-center align-items-center'}>
                            <Spinner className={'m-3'} animation="border"/>
                        </Container>
                    }
                    {
                        comments &&
                        comments.map((value, index) => {
                            // const name = value.author.firstName + ' ' + value.author.lastName
                            return <ForumComment key={index} {...value}/> // name={name} content={value.content}/>
                        })
                    }
                </>
            }
        </Container>
    )
}