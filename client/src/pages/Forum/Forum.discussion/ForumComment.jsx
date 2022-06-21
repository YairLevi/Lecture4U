import { Card } from 'react-bootstrap'
import UserLabel from "../../../components/UserLabel";


export default function ForumComment({ value }) {
    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <div className={'d-flex justify-content-between'}>
                    <UserLabel {...value.author} noMargin={true} size={'regular'}/>
                    <p className={'ms-2'}>{new Date(value.createdAt).parseEventDate()}</p>
                </div>
                <Card.Text style={{ whiteSpace: 'pre-wrap' }}>
                    {value.content}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}