import { Container, Spinner } from 'react-bootstrap'
import { useParams } from "react-router-dom";
import requests from "../../helpers/requests";
import React, { useEffect, useState } from "react";
import GroupMembers from "./GroupMembers";
import GroupDescription from "./GroupDescription";
import GroupFiles from "./GroupFiles";
import GroupChat from "./GroupChat";
import useLoadingEffect from "../../hooks/useLoadingEffect";


export default function Group(props) {
    const { id } = useParams()
    const [data, setData] = useState()

    const loading = useLoadingEffect(async () => {
        const res = await requests.get('/groups/group-data', { groupId: id })
        const data = await res.json()
        setData(data)
    }, [])

    return loading ?
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