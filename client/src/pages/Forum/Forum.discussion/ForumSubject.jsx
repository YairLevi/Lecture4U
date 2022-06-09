import { Card } from 'react-bootstrap'
import UserLabel from "../../../components/UserLabel";


export default function ForumSubject({ title, author, content, createdAt }) {
    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <Card.Text as={'h1'}>
                    {title}
                </Card.Text>
                <Card.Text>
                    <UserLabel size={'small'} {...author} />
                    At <strong>{new Date(createdAt).getMonthAndDay()}</strong>
                </Card.Text>
                <br/>
                <Card.Text>
                    {content}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}