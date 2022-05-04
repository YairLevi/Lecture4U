import { Card, Button } from "react-bootstrap";
import EditText from "../../modals/EditText";
import { useState } from "react";


export default function GroupDescription(props) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Card className={'mb-3'}>
                <Card.Header>
                    <Card.Title>
                        Description
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text style={{whiteSpace: 'pre-wrap'}}>
                        {props.description}
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Button onClick={() => setOpen(true)}>
                        Edit
                    </Button>
                </Card.Footer>
            </Card>

            <EditText show={open} onHide={() => setOpen(false)} content={props.description}/>
        </>
    )
}