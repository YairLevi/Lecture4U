import React from 'react'
import { Card, Container } from 'react-bootstrap'
import './CourseCard.scss'


export default function CourseCard({ image, width, name, teacher, description }) {
    return (
        <Container className={'d-flex justify-content-center mb-4 p-0'}>
            <Card className={'card-pop'} style={{
                width: width ? width : '22rem',
                borderRadius: '2rem',
                overflow: 'hidden',
                cursor: 'pointer',
            }}>
                <Card.Img src={image}/>
                <Card.Body>
                    <Card.Title as={"h4"} className={'card-title'}>
                        {name}
                    </Card.Title>
                    <Card.Subtitle className={'card-subtitle'}>
                        {teacher}
                    </Card.Subtitle>
                    <br/>
                    <Card.Text className={'card-description'}>
                        {description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    )
}