import { Card } from 'react-bootstrap'


export default function ForumSubject({ title, author, content, createdAt }) {
    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <Card.Text as={'h1'}>
                    {title}
                </Card.Text>
                <Card.Text>
                    By {author}<br/>At {createdAt}
                </Card.Text>
                <br/>
                <Card.Text>
                    {content}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}