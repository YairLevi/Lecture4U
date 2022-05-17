import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import AddMember from "./modals/AddMember";


export default function GroupMembers(props) {
    const [open, setOpen] = useState(false)
    console.log(props.users)

    return (
        <>
            <Card className={'mb-3'}>
                <Card.Header>
                    <Card.Title>
                        Members
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {
                        props.users.map((value, index) => {
                            return <Card.Text key={index}>
                                {value.firstName} {value.lastName}
                            </Card.Text>
                        })
                    }
                </Card.Body>
                <Card.Footer>
                    <Button onClick={() => setOpen(true)}>
                        Add Member
                    </Button>
                </Card.Footer>
            </Card>

            <AddMember show={open} onHide={() => setOpen(false)}/>
        </>
    )
}