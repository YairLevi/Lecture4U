import { Card } from "react-bootstrap";


export default function SubmissionTab(props) {
    return (
        <Card className={'mt-3'}>
            <Card.Body>
                {
                    props.value.userIds.map((value, index) => {
                        return <Card.Text key={index}>
                            {value.firstName} {value.lastName}
                        </Card.Text>
                    })
                }
                <Card.Text>
                    {props.value.text}
                </Card.Text>
                {
                    props.value.files && props.value.files.map((value, index) => (
                        <div key={index}>
                            <a href={value.url}>{value.name}</a>
                        </div>
                    ))
                }
                <Card.Text>
                    {props.value.date}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}