import { Container, Button, Spinner, Card, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AddGroup from "./modals/AddGroup";
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import { useNav } from "../../contexts/NavContext";
import GroupTab from "./GroupTab";
import Avatar from "@mui/material/Avatar";
import { AvatarGroup } from "@mui/material";
import './styles.scss'
import { useAuth } from "../../contexts/AuthContext";
import GroupCard from "./GroupCard";
import CardSlot from "../../components/CourseCard/CardSlot";


export default function GroupsPage(props) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [groups, setGroups] = useState()
    const { currentUser } = useAuth()

    async function loadGroups() {
        setLoading(true)
        const res = await requests.get('/groups/get-groups')
        const data = await res.json()
        setGroups(data)
        setLoading(false)
    }

    useEffect(() => loadGroups(), [])

    function openModal() {
        setOpen(true)
    }

    function closeModal() {
        setOpen(false)
    }

    const avatarSize = 30

    return (
        <>
            <Container fluid className={'p-3 h-100'}>
                <h3 style={{ fontWeight: 'normal' }} className={'m-3'}>Groups</h3>
                {
                    loading ?
                        <Container className={'d-flex justify-content-center align-items-center'}>
                            <Spinner className={'m-3'} animation="border"/>
                        </Container> :
                        <Row>
                            {
                                groups && groups.map((value, index) => {
                                    return <Col key={index} className={'col-12 col-md-6 col-lg-4 col-xl-3'}>
                                            <GroupCard {...value} />
                                        </Col>
                                })
                            }
                        </Row>
                    // loading ?
                    //     <Container className={'d-flex justify-content-center align-items-center'}>
                    //         <Spinner className={'m-3'} animation="border"/>
                    //     </Container> :
                    //     groups && groups.map((value, index) => <GroupTab key={index} value={value}/>)
                }
                <Button onClick={openModal}>Add Group</Button>
            </Container>

            <AddGroup show={open} onHide={closeModal}/>
        </>
    )
}