import { Card } from 'react-bootstrap'


export default function ForumComment({ name, content}) {
    return (
        <Card className={'mt-3'}>
            <Card.Body>
                <Card.Text style={{fontWeight: 'bold', color: 'gray'}}>
                    {name}
                </Card.Text>
                <Card.Text>
                    {content}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}