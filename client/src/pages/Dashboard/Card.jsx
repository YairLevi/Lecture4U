import './Card.scss'
import { Card as BootstrapCard, Col, Row } from 'react-bootstrap'


export default function Card(props) {
    return (
        <div className="card p-3 ms-4 me-4 h-100" style={{
            backgroundColor: props.mainColor,
        }}>
            <div className={'d-flex justify-content-between ps-3 pe-3 pt-3'}>
                <div>
                    <h1>{props.value}</h1>
                    <h5 style={{ color: "#555555" }}>{props.title}</h5>
                </div>
                <i className={props.icon} style={{
                    fontSize: '8rem',
                    color: props.subColor,
                    position: "absolute",
                    right: 10,
                    top: 10
                }}/>
            </div>
            <div className={'ps-3 pe-3 pb-3'}>
                <div className="mt-3">
                    <div className="mt-3">
                        <span className="text2 me-2" style={{ color: "gray" }}>
                            {props.subtitle}<br/>
                        </span>
                        <span className="text1" style={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap'}}>
                            {props.subvalue}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}