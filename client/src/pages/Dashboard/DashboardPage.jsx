import { Button, ButtonGroup, Card, Col, Container, Dropdown, Row, Spinner, ToggleButton } from 'react-bootstrap'
import React, { useEffect, useState } from "react";
import requests from "../../helpers/requests";
import OverviewPanel from "./OverviewPanel";
import useLoadingEffect from "../../hooks/useLoadingEffect";
import Timeline from "../../components/Timeline/Timeline";
import DailySchedule from './DailySchedule/DailySchedule'
import useLocalStorage from "../../hooks/useLocalStorage";
import TeacherOverview from "./Teacher/TeacherOverview";
import { useLoading } from "../../hooks/useLoading";
import { useAuth } from "../../contexts/AuthContext";



export default function DashboardPage(props) {
    const { currentUser} = useAuth()
    const [data, setData] = useLocalStorage('dashboard-data', null)
    const [value, setValue] = useLocalStorage('dashboard-state', 'student')
    const radios = [
        { name: 'As Student', value: 'student' },
        { name: 'As Teacher', value: 'teacher' },
    ]

    const [loading, getDashboardData] = useLoading(async () => {
        const res = await requests.get('/dashboard/get-dashboard-data')
        const json = await res.json()
        setData(json)
    })

    const loadingFirst = useLoadingEffect(async function () {
        if (data == null) {
            const res = await requests.get('/dashboard/get-dashboard-data')
            const json = await res.json()
            setData(json)
        }
    }, [])

    return loading || loadingFirst ?
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container> :
        <>
            <Container fluid className={'m-3 h-100'} style={{ overflowX: "hidden"}}>
                <div className={'d-flex justify-content-between ms-5 mb-3 me-5'}>
                    <h3 style={{ color: 'gray', fontWeight: 'normal' }}>
                        Hello {currentUser.firstName}, let's learn something new today!
                        <i className={'bx bx-sun ms-2'} style={{ fontSize: '1.5rem' }}/>
                    </h3>
                    <div>
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
                    <Button className={'ms-2'} onClick={getDashboardData}>Refresh Dashboard</Button>
                </div>
                </div>
                <Row>
                    {value === 'student' ? <OverviewPanel {...data}/> : <TeacherOverview {...data}/>}
                </Row>
                <Row className={'d-flex justify-content-evenly ps-0 pe-0'}>
                    <Col className={'col-lg-6'}>
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