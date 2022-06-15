import { Button, Container, Form, Spinner } from "react-bootstrap";
import ForumComment from "../Forum/Forum.discussion/ForumComment";
import { useParams } from 'react-router-dom'
import React, { useState } from "react";
import requests from "../../helpers/requests";
import { useLoading } from "../../hooks/useLoading";
import { useRefresh } from "../../hooks/useRefresh";


export default function GroupChat(props) {
    const [content, setContent] = useState()
    const { id } = useParams()
    const refresh = useRefresh()
    const [loading, action] = useLoading(async () => {
        const res = await requests.post('/groups/message', { content, groupId: id })
        return res.status !== 200
    })

    async function sendMessage() {
        if (content === '') return
        await action()
        refresh()
    }

    return (
        <Container className={'col-8 h-100 overflow-auto'}>
            <Container className={'m-0 overflow-auto'} style={{ height: '85%' }}>
                {
                    props.comments &&
                    props.comments.map((value, index) => <ForumComment key={index} value={value}/>)
                }
            </Container>
            <Container className={'d-flex pt-2 pb-2'} style={{ height: '15%', borderTop: '1px solid lightgray' }}>
                <Form className={'col-10'}>
                    <Form.Control as={'textarea'} style={{ resize: 'none' }} className={'h-100'}
                                  onChange={e => setContent(e.target.value)} placeholder={'Type a message...'}/>
                </Form>
                <Button className={'ms-2 col-2 d-flex flex-column align-items-center'}
                        style={{ height: "fit-content" }}
                        onClick={sendMessage}
                        disabled={loading}
                >
                    Send
                    {loading && <Spinner animation={"border"}/>}
                </Button>
            </Container>
        </Container>
    )
}