import React from 'react'
import { Card, Container } from 'react-bootstrap'
import './CourseCard.scss'
import { useNav } from "../../contexts/NavContext";


export default function CourseCard(props) {
    const { relativeNav } = useNav()

    function handleClick() {
        relativeNav(`/${props.id}/material`)
    }

    return (
        <Container className={'d-flex justify-content-center mb-4 p-0 h-100'} onClick={handleClick}>
            <Card className={'card-pop'} style={{
                width: props.width ? props.width : '22rem',
                borderRadius: '2rem',
                overflow: 'hidden',
                cursor: 'pointer',
            }}>
                <Card.Img src={props.image}/>
                <Card.Body>
                    <Card.Title as={"h4"} className={'card-title'}>
                        {props.name}
                    </Card.Title>
                    <Card.Subtitle className={'card-subtitle'}>
                        {props.teacher}
                    </Card.Subtitle>
                    <br/>
                    <Card.Text className={'card-description'}>
                        {props.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    )
}