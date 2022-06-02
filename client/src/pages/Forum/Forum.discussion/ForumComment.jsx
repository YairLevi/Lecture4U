import { Card } from 'react-bootstrap'
import UserLabel from "../../../components/UserLabel";


export default function ForumComment(props) {
    return (
        <Card className={'mb-3'}>
            <Card.Body>
                <UserLabel {...props.author} noMargin={true} size={'regular'}/>
                <Card.Text>
                    {props.content}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}