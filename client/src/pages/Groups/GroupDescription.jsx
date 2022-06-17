import { Card, Button } from "react-bootstrap";
import EditText from "./modals/EditText";
import { useState } from "react";


export default function GroupDescription(props) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Card className={'mb-3'}>
                <Card.Header className={'bg-light'} style={{
                    color: "#003aa9",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }}>
                    <Card.Title>
                        Description
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text style={{whiteSpace: 'pre-wrap'}}>
                        {props.description}
                    </Card.Text>
                </Card.Body>
                <Card.Footer style={{
                    backgroundColor: 'white',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10
                }}>
                    <Button onClick={() => setOpen(true)}>
                        Edit
                    </Button>
                </Card.Footer>
            </Card>

            <EditText show={open} onHide={() => setOpen(false)} content={props.description}/>
        </>
    )
}