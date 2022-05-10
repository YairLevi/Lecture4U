import { Button, Card } from "react-bootstrap";
import React from "react";
import { useNav } from "../../contexts/NavContext";


export default function GroupTab({ value }) {
    const { relativeNav } = useNav()

    return (
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
            <Card.Footer>
                <Button onClick={() => relativeNav(`/${value._id}`)}>View Group</Button>
            </Card.Footer>
        </Card>
    )
}