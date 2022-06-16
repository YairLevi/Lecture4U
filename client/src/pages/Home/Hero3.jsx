import React from 'react';
import 'bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import image from '../../assets/img.png';


export default function Hero3(props) {
    return (
        <Container className={"container-lg pt-4 pb-4"}>
            <Row className={"justify-content-center align-items-center"}>
                <Col className={"text-center text-md-start"}>
                    <h1 style={{ fontWeight: 'bold' }}>
                        AI Is Our Friend
                    </h1>
                    <h5>
                        Ease your way through courses with our Artificial Intelligence tools, like Speech-To-Text,
                        Image-To-Text, and schedule optimization
                    </h5>
                </Col>
                <Col className={"text-center col-md-6 col-12 d-md-block"}>
                    <img className={"img-fluid"} src={`${image}`} alt={"pic"}/>
                </Col>
            </Row>
        </Container>
    );
}