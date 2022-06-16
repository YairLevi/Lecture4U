import React from 'react';
import 'bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import image from '../../assets/group-studying.png';


export default function Hero2(props) {
    return (
        <Container className={"container-lg pt-4 pb-4"}>
            <Row className={"justify-content-center align-items-center"} dir={'rtl'}>
                <Col className={"text-center text-md-start"}>
                    <h1 style={{ fontWeight: 'bold' }}>
                        Study With Friends
                    </h1>
                    <h5>
                        Work collectively and learn together using our study groups
                    </h5>
                </Col>
                <Col className={"text-center col-md-6 col-12 d-md-block"}>
                    <img className={"img-fluid"} src={`${image}`} alt={"pic"}/>
                </Col>
            </Row>
        </Container>
    );
}