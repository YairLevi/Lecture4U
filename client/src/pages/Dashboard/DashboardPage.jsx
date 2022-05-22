import { Col, Container, Row, Spinner } from 'react-bootstrap'
import Card from "./Card";
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import OverviewPanel from "./OverviewPanel";
import useLoadingEffect from "../../hooks/useLoadingEffect";


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
        <Container fluid className={'p-4'}>
            <Row className={'d-flex row-d'}>
                <OverviewPanel {...data}/>
            </Row>
            <Row>
                <Col className={'col-lg-7'}>
                    <h2 className={'p-3'} style={{ fontWeight: "normal" }}>Notifications</h2>
                    <Card/>
                </Col>
                <Col className={'col-lg-5'}>
                    <h2 className={'p-3'} style={{ fontWeight: "normal" }}>Events</h2>
                    <Card/>
                </Col>
            </Row>
        </Container>
}