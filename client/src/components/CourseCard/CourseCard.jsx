import React from 'react'
import { Card, Container } from 'react-bootstrap'
import './CourseCard.scss'


export default function CourseCard({ image, width, title, subtitle, description }) {
    return (
        <Container className={'d-flex justify-content-center mb-4 p-0'}
                   style={{ cursor: 'pointer', }}>
            <Card style={{
                width: width ? width : '22rem',
                borderRadius: '2rem',
                overflow: 'hidden',
            }}>
                <Card.Img src={image}/>
                <Card.Body>
                    <Card.Title as={"h4"} className={'title'}>
                        {title}
                    </Card.Title>
                    <Card.Subtitle className={'subtitle'}>
                        {subtitle}
                    </Card.Subtitle>
                    <br/>
                    <Card.Text className={'description'}>
                        {description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    )
}