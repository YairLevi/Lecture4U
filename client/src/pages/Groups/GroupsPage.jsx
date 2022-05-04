import { Container, Button, Spinner, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AddGroup from "../../modals/AddGroup";
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import { useNav } from "../../hooks/NavContext";
import GroupTab from "./GroupTab";


export default function GroupsPage(props) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [groups, setGroups] = useState()

    async function loadGroups() {
        setLoading(true)
        const res = await requests.get('/groups/get-groups')
        const data = await res.json()
        setGroups(data)
        console.log(data)
        setLoading(false)
    }

    useEffect(() => loadGroups(), [])

    function openModal() {
        setOpen(true)
    }

    function closeModal() {
        setOpen(false)
    }

    return (
        <>
            <Container>
                <h3>Groups</h3>
                {
                    loading ?
                        <Container className={'d-flex justify-content-center align-items-center'}>
                            <Spinner className={'m-3'} animation="border"/>
                        </Container> :
                        groups && groups.map((value, index) => <GroupTab key={index} value={value}/>)
                }
                <Button onClick={openModal}>Add Group</Button>
            </Container>

            <AddGroup show={open} onHide={closeModal}/>
        </>
    )
}