import { Container, Card, Spinner } from 'react-bootstrap'
import { useParams } from "react-router-dom";
import requests from "../../helpers/requests";
import React, { useEffect, useState } from "react";
import GroupMembers from "./GroupMembers";
import GroupDescription from "./GroupDescription";
import GroupFiles from "./GroupFiles";
import ForumComment from "../Forum/Forum.discussion/ForumComment";
import GroupChat from "./GroupChat";
import useLoader from "./useLoader";


export default function Group(props) {
    const { id } = useParams()
    const [data, setData] = useState()
    // const [loading, setLoading] = useState(false)
    //
    // async function getGroupData() {
    //     setLoading(true)
    //     const res = await requests.get('/groups/group-data', { groupId: id })
    //     const data = await res.json()
    //     console.log(data)
    //     setData(data)
    //     setLoading(false)
    // }
    const loading = useLoader(async function () {
        const res = await requests.get('/groups/group-data', { groupId: id })
        const data = await res.json()
        console.log(data)
        setData(data)
    })

    // useEffect(() => getGroupData(), [])

    return loading || data === undefined ?
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container>
        :
        <Container className={'d-flex h-100 pb-3'}>
            <GroupChat comments={data.comments}/>
            <Container className={'col-4 d-flex flex-column'}>
                <GroupMembers users={data.userIds}/>
                <GroupDescription description={data.description}/>
                <GroupFiles files={data.files}/>
            </Container>
        </Container>

}