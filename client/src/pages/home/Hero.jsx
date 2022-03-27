import React from 'react';
import 'bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import image from '../../assets/hero_section_image.jpg';


export default function Hero(props) {
    return (
        <Container className={"container-lg pt-4 pb-4"}>
            <Row className={"justify-content-center align-items-center"}>
                <Col className={"text-center text-md-start"}>
                    <h1 style={{ fontWeight: 'bold' }}>
                        Anyone Can Share Knowledge, Anywhere, Anytime.
                    </h1>
                    <h5>
                        Sign up and join a vast online learning community.
                    </h5>
                </Col>
                <Col className={"text-center d-none d-md-block"}>
                    <img className={"img-fluid"} src={`${image}`} alt={"pic"}/>
                </Col>
            </Row>
        </Container>
    );
}