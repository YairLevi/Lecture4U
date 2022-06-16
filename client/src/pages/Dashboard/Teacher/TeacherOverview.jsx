import { Card } from "react-bootstrap";
import AccessChart from "./AccessChart";
import RatingChart from "./RatingChart";
import React from "react";


export default function TeacherOverview(props) {
    return (
        <div>
            <h2 className={'p-3 ms-5'} style={{ fontWeight: "normal" }}>Statistics</h2>
            <div className={'d-flex justify-content-evenly'}>
                <Card className={'col-6'}>
                    <Card.Body className={'d-flex flex-column'}>
                        <RatingChart ratings={props.ratings}/>
                    </Card.Body>
                </Card>
                <Card className={'col-5 ms-4'}>
                    <Card.Body>
                        <AccessChart access={props.access}/>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}