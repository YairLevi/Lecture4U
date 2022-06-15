import React, { useEffect, useState } from 'react'
import { Container, Card, Button, Spinner } from "react-bootstrap";
import Unit from './Unit'
import { Icon } from "../../components/Sidebar/Item";
import { useLocation, useSearchParams } from "react-router-dom";
import requests from "../../helpers/requests";
import AddUnit from "./modals/AddUnit";
import { useParams } from "react-router";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { ERRORS } from "../../helpers/errors";
import { useNav } from "../../contexts/NavContext";
import useLocalStorage from "../../hooks/useLocalStorage";
import UserLabel from "../../components/UserLabel";


export default function Material(props) {
    const [showAddUnit, setShowAddUnit] = useState(false)
    const [data, setData] = useState(null)
    const [open, setOpen] = useState(false)
    const { id } = useParams()
    const { fullNav } = useNav()
    const [searchParams] = useSearchParams()
    const [state,] = useLocalStorage('state')
    const isTeacher = state === 'teacher'


    useEffect(async () => {
        // const id = getCourseID(location)
        const res = await requests.get('/course/data', { code: id })
        if (res.status !== 200) {
            // error. put some error screen here.
        } else {
            const json = await res.json()
            setData(json)
        }
    }, [])

    function openConfirm() {
        setOpen(true)
    }

    const settings = {
        action: isTeacher ? 'delete' : 'leave',
        buttonAction: isTeacher ? 'Delete' : 'Leave',
    }

    async function performAction() {
        const res = await requests.delete(`/course/${settings.action}`, { courseId: id })
        if (res.status !== 200) return false
        else fullNav('/main/courses')
    }

    return !data ? (
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container>
    ) : (
        <>
            <Container className={'p-3 pb-5'}>
                <div className={'d-flex justify-content-between'}>
                    <div>
                        <h1 style={{ fontSize: '2rem' }}>{data.name}</h1>
                        <UserLabel size={'small'} {...data.teacher} />
                    </div>
                    <p style={{ color: 'gray', fontSize: '0.9rem' }}>To join this course, use the code:<br/>{id}</p>
                </div>
                <br/>
                <h6>{data.description}</h6>
                {
                    isTeacher && <Button className={'mt-3 mb-3'} onClick={() => setShowAddUnit(true)}>
                        <Icon iconClass={'bi-plus-circle'}/>
                        Add Unit
                    </Button>
                }
                {data.units.map((value, index) => {
                    return <Unit key={index}
                                 courseId={data._id}
                                 unitId={value._id}
                                 name={value.name}
                                 text={value.text}
                                 subjects={value.subjects}
                                 isTeacher={isTeacher}
                    />
                })}
                <Button variant={'outline-danger'} onClick={openConfirm}>{settings.buttonAction} Course</Button>
            </Container>


            <AddUnit show={showAddUnit} onHide={() => setShowAddUnit(false)}/>
            <ConfirmationModal text={`${settings.action} course ${data.name}`}
                               func={performAction}
                               show={open}
                               onHide={() => setOpen(false)}/>
        </>
    )
}