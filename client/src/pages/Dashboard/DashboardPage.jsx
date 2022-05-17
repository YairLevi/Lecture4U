import { Col, Container, Row } from 'react-bootstrap'
import Card from "./Card";
import { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import OverviewPanel from "./OverviewPanel";


export default function DashboardPage(props) {
    const [data, setData] = useState()

    useEffect(() => {
        (async function () {
            const res = await requests.get('/dashboard/get-dashboard-data')
            const json = await res.json()
            setData(json)
        })()
    }, [])

    return !data ? <h1>hello</h1> : (
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
    )
}