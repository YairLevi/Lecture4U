import { Button, Card } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import { AvatarGroup } from "@mui/material";
import React, { useState } from "react";
import { useNav } from "../../contexts/NavContext";
import ConfirmationModal from "../../modals/ConfirmationModal";
import requests from "../../helpers/requests";

const AVATAR_SIZE = 30

export default function GroupCard(props) {
    const { relativeNav } = useNav()
    const [openConfirm, setOpenConfirm] = useState(false)

    async function leaveGroup() {
        const groupId = props._id
        const res = await requests.delete('/groups/leave-group', { groupId })
        return res.status === 200
    }

    return (
        <Card style={{
            maxWidth: '22rem',
            cursor: 'pointer',
        }} className={'m-3'} onClick={() => relativeNav(`/${props._id}`)}>
            <Card.Body>
                <div className={'d-flex justify-content-between mb-3'}>
                    <Avatar src={props.owner?.profileImage?.url[0]}/>
                    <i style={{ fontSize: '1.5rem' }} onClick={e => {
                        e.stopPropagation()
                        setOpenConfirm(true)
                    }} className={'d-flex align-items-center bx bx-trash'}/>
                </div>
                <Card.Title>
                    {props.name}
                </Card.Title>
                <Card.Text style={{ color: 'gray' }} className={'limit-lines'}>
                    {props.description}
                </Card.Text>
                <div className={'d-flex justify-content-between align-items-center mt-4'}>
                    <Card.Text style={{ color: 'gray' }}>
                        Created At:<br/>{new Date(props.createdAt).parseEventDate()}
                    </Card.Text>
                    <AvatarGroup spacing={5} max={4} style={{ width: '10px' }} className={'avatar-group'}>
                        {
                            props.userIds.map((value, index) => {
                                return <Avatar src={value.profileImage?.url[0]} key={index} style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}/>
                            })
                        }
                    </AvatarGroup>
                </div>
            </Card.Body>

            <ConfirmationModal text={`leave group ${props.name}`}
                               show={openConfirm}
                               onHide={() => setOpenConfirm(false)}
                               func={leaveGroup} />
        </Card>
    )
}