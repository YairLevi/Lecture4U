import { Button, Card } from "react-bootstrap";
import React, { useState } from "react";
import { useNav } from "../../contexts/NavContext";
import ConfirmationModal from "../../modals/ConfirmationModal";
import requests from "../../helpers/requests";


export default function GroupTab({ value }) {
    const { relativeNav } = useNav()
    const [open, setOpen] = useState(false)

    async function leaveGroup() {
        const groupId = value._id
        const res = await requests.delete('/groups/leave-group', { groupId })
        return res.status === 200
    }

    return (
        <>
            <Card>
                <Card.Header>
                    <Card.Title>{value.name}</Card.Title>
                    <Card.Text>{value.createdAt}</Card.Text>
                </Card.Header>
                <Card.Body>
                    <Card.Text>users:</Card.Text>
                    {
                        value.userIds.map((value, index) => {
                            return (
                                <Card.Text key={index}>
                                    {value.firstName} {value.lastName}
                                </Card.Text>
                            )
                        })
                    }
                </Card.Body>
                <Card.Footer className={'d-flex'}>
                    <Button onClick={() => relativeNav(`/${value._id}`)}>View Group</Button>
                    <Button variant={'outline-danger'} className={'ms-2'} onClick={() => setOpen(true)}>Leave
                        Group</Button>
                </Card.Footer>
            </Card>

            <ConfirmationModal text={`leave the group: ${value.name}`}
                               func={leaveGroup}
                               onHide={() => setOpen(false)}
                               show={open}
            />
        </>
    )
}