import React from 'react'
import { Card, Container } from 'react-bootstrap'
import './CourseCard.scss'
import { useNav } from "../../contexts/NavContext";
import UserLabel from "../UserLabel";


export default function CourseCard(props) {
    const { relativeNav } = useNav()

    function handleClick() {
        relativeNav(`/${props.id}/material`)
    }

    return (
        <Container className={'d-flex justify-content-center mb-4 p-0'} onClick={handleClick}>
            <Card className={'card-pop'} style={{
                width: props.width ? props.width : '16rem',
                overflow: 'hidden',
                cursor: 'pointer',
            }}>
                <Card.Img src={props.image} height={130}/>
                <Card.Body>
                    <Card.Title as={"h4"} className={'card-title'}>
                        {props.name}
                    </Card.Title>
                    <Card.Subtitle className={'card-subtitle'}>
                        <UserLabel size={'very-small'} {...props.teacher}/>
                    </Card.Subtitle>
                    <Card.Text className={'card-description'}>
                        {props.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    )
}