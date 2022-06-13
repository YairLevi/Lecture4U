import { ButtonGroup, Card, Col, Container, Row, Spinner, ToggleButton } from 'react-bootstrap'
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import OverviewPanel from "./OverviewPanel";
import useLoadingEffect from "../../hooks/useLoadingEffect";
import Timeline from "../../components/Timeline/Timeline";
import DailySchedule from './DailySchedule/DailySchedule'
import useLocalStorage from "../../hooks/useLocalStorage";
import TeacherOverview from "./Teacher/TeacherOverview";


export default function DashboardPage(props) {
    const [data, setData] = useState()
    const [value, setValue] = useLocalStorage('dashboard-state', 'student')
    const radios = [
        { name: 'As Student', value: 'student' },
        { name: 'As Teacher', value: 'teacher' },
    ]

    const loading = useLoadingEffect(async function () {
        const res = await requests.get('/dashboard/get-dashboard-data')
        const json = await res.json()
        setData(json)
    }, [])

    return loading ?
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container> :
        <>
            <ButtonGroup style={{ height: 'fit-content' }}>
                {radios.map((radio, idx) => (
                    <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="radio"
                        variant='outline-primary'
                        name="radio"
                        value={radio.value}
                        checked={value === radio.value}
                        onChange={e => setValue(e.currentTarget.value)}
                    >
                        {radio.name}
                    </ToggleButton>
                ))}
            </ButtonGroup>
            <Container fluid className={'m-3 h-100'}>
                <Row>
                    { value === 'student' ? <OverviewPanel {...data}/> : <TeacherOverview {...data}/> }
                </Row>
                <Row>
                    <Col className={'col-lg-7'}>
                        <h2 className={'p-3'} style={{ fontWeight: "normal" }}>Events</h2>
                        <Timeline events={data.events}/>
                    </Col>
                    <Col className={'col-lg-5'}>
                        <h2 className={'p-3'} style={{ fontWeight: "normal" }}>Schedule</h2>
                        <DailySchedule schedule={data.schedule}/>
                    </Col>
                </Row>
            </Container>
        </>
}