import React, { useEffect, useState } from 'react'
import {
    Button,
    ButtonGroup,
    Container,
    FormControl,
    InputGroup,
    Row,
    Spinner,
    ToggleButton,
    ToggleButtonGroup
} from 'react-bootstrap'
import CardSlot from "../../components/CourseCard/CardSlot";
import { useSearchParams } from "react-router-dom";
import requests from "../../helpers/requests";
import useLocalStorage from "../../hooks/useLocalStorage";
import NewCourse from "./modals/NewCourse";
import AddCourse from "./modals/AddCourse";


export default function Courses() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [params, setParams] = useSearchParams()
    const [value, setValue] = useLocalStorage('state', 'student')
    const [openModal, setOpenModal] = useState(false)

    const radios = [
        { name: 'As Student', value: 'student' },
        { name: 'As Teacher', value: 'teacher' },
    ]

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const res = await requests.get(`/course/${value}`)
            if (res.status !== 200) return
            const json = await res.json()
            setData(json)
            setLoading(false)
        }
        fetchData()
    }, [params, value])


    return loading ? (
        <Container className={'d-flex justify-content-center align-items-center'}>
            <Spinner className={'m-3'} animation="border"/>
        </Container>
    ) : (
        <Container fluid className={'h-100 p-3'}>
            <Container>
                <InputGroup className="mb-5">
                    <FormControl placeholder="Search for a course..." onChange={e => setSearchValue(e.target.value)}/>
                    <ButtonGroup>
                        {radios.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}`}
                                type="radio"
                                variant='outline-primary'
                                name="radio"
                                value={radio.value}
                                checked={value === radio.value}
                                onChange={(e) => setValue(e.currentTarget.value)}
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                    <Button className={'ms-3 rounded-3'} onClick={() => setOpenModal(true)}>Add Course</Button>
                </InputGroup>
            </Container>
            <Row>
                {data && data.map((value, index) => {
                    if (value.name.includes(searchValue))
                        return <CardSlot key={index} {...value}/>
                })}
            </Row>

            {
                value === 'student' ?
                    <AddCourse centered show={openModal} onHide={() => setOpenModal(false)}/> :
                    <NewCourse centered show={openModal} onHide={() => setOpenModal(false)}/>
            }
        </Container>
    )
}