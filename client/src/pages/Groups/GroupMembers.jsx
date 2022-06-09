import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import AddMember from "./modals/AddMember";
import UserLabel from "../../components/UserLabel";


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
                <Card.Body className={'overflow-auto'} style={{ height: 200 }}>
                    {
                        props.users.map((value, index) => {
                            return <UserLabel size={'small'} noMargin={true} {...value} key={index}/>
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