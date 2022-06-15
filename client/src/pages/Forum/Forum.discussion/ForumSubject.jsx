import { Card } from 'react-bootstrap'
import UserLabel from "../../../components/UserLabel";


export default function ForumSubject({ title, author, content, createdAt }) {
    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <Card.Text as={'h1'}>
                    {title}
                </Card.Text>
                <UserLabel size={'very-small'} {...author} />
                <Card.Text style={{ fontSize: '0.9rem'}}>
                    {new Date(createdAt).getMonthAndDay()}
                </Card.Text>
                <br/>
                <Card.Text>
                    {content}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}