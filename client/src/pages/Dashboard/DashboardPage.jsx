import { Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import OverviewPanel from "./OverviewPanel";
import useLoadingEffect from "../../hooks/useLoadingEffect";
import Timeline from "../../components/Timeline/Timeline";
import DailySchedule from './DailySchedule/DailySchedule'


export default function DashboardPage(props) {
    const [data, setData] = useState()

    const loading = useLoadingEffect(async function () {
        const res = await requests.get('/dashboard/get-dashboard-data')
        const json = await res.json()
        setData(json)
    }, [])

    return loading ?
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container> :
        <Container fluid className={'p-4 h-100'}>
            <Row>
                <OverviewPanel {...data}/>
            </Row>
            <Row>
                <Col className={'col-lg-7'}>
                    <h2 className={'p-3'} style={{ fontWeight: "normal" }}>Events</h2>
                    <Timeline events={data.events}/>
                </Col>
                <Col className={'col-lg-5'}>
                    <h2 className={'p-3'} style={{ fontWeight: "normal" }}>Schedule</h2>
                    <DailySchedule schedule={data.schedule} />
                </Col>
            </Row>
        </Container>
}