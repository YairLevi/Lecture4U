import { Col } from "react-bootstrap";
import React from "react";


export default function CardWrapper(props) {
    return (
        <Col className={'col-12 col-md-6 col-lg-4'}>
            {props.children}
        </Col>
    )
}