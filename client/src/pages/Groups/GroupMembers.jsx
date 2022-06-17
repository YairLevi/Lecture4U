import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import AddMember from "./modals/AddMember";
import UserLabel from "../../components/UserLabel";


export default function GroupMembers(props) {
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
                <Card.Footer style={{
                    backgroundColor: 'white',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10
                }}>
                    <Button onClick={() => setOpen(true)}>
                        Add Member
                    </Button>
                </Card.Footer>
            </Card>

            <AddMember show={open} onHide={() => setOpen(false)}/>
        </>
    )
}