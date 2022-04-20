import { Card, FormControl, Button } from 'react-bootstrap'
import { useState } from "react";
import requests from "../../../helpers/requests";


export default function ForumTextbox({ currentDiscussion }) {
    const [content, setContent] = useState('')

    async function addComment() {
        const res = await requests.post('/forum/create/comment', {
            content, discussionId: currentDiscussion.id
        })
    }

    return (
        <Card className={'mt-3'}>
            <Card.Body>
                <Card.Text>
                    reply here:
                </Card.Text>
                <FormControl as={"textarea"} onChange={e => setContent(e.target.value)}/>
                <Button className={'mt-3'} onClick={addComment}>Reply</Button>
            </Card.Body>
        </Card>
    )
}