import { Card, FormControl, Button, Container } from 'react-bootstrap'
import { useState } from "react";
import requests from "../../../helpers/requests";


export default function ForumTextbox({ currentDiscussion, refresh }) {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    async function addComment() {
        setLoading(true)
        const res = await requests.post('/forum/create/comment', {
            content, discussionId: currentDiscussion._id
        })
        setContent('')
        setLoading(false)
        refresh()
    }

    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <Card.Text>
                    reply here:
                </Card.Text>
                <FormControl as={"textarea"} value={content} onChange={e => setContent(e.target.value)}/>
                <Container className={'d-flex p-0 m-0 mt-3'}>
                    <Button onClick={addComment}>Reply</Button>
                    { loading && <Card.Text className={'p-2'}>Posting...</Card.Text> }
                </Container>
            </Card.Body>
        </Card>
    )
}