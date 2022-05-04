import { Button, Container, Form } from "react-bootstrap";
import ForumComment from "../Forum/Forum.discussion/ForumComment";
import { useParams } from 'react-router-dom'
import { useState } from "react";
import requests from "../../helpers/requests";


export default function GroupChat(props) {
    const [content, setContent] = useState()
    const { id } = useParams()

    async function sendMessage() {
        if (content === '') return
        const res = await requests.post('/groups/message', { content, groupId: id})
        return res.status !== 200
    }

    return (
        <Container className={'col-8 h-100 overflow-auto'}>
            <Container className={'m-0 overflow-auto'} style={{ height: '85%' }}>
                {
                    props.comments &&
                    props.comments.map((value, index) => {
                        const name = value.author.firstName + ' ' + value.author.lastName
                        return <ForumComment key={index} name={name} content={value.content}/>
                    })
                }
            </Container>
            <Container className={'d-flex pt-2 pb-2'} style={{ height: '15%', borderTop: '1px solid lightgray' }}>
                <Form className={'col-10'}>
                    <Form.Control as={'textarea'} style={{ resize: 'none' }} className={'h-100'}
                                  onChange={e => setContent(e.target.value)} placeholder={'Type a message...'}/>
                </Form>
                <Button className={'ms-2 col-2'} style={{ height: "fit-content" }} onClick={sendMessage}>
                    Send
                </Button>
            </Container>
        </Container>
    )
}