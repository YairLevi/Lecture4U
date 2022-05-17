import './Card.scss'


export default function Card(props) {
    return (
        <div className="card p-3 mb-2">
            <div className={'d-flex justify-content-between ps-3 pe-3 pt-3'}>
                <div>
                    <h1>{props.value}</h1>
                    <h5 style={{ color: "gray" }}>{props.title}</h5>
                </div>
                <i style={{ fontSize: '4rem', color: 'grey' }} className={'bx bx-edit'}/>
            </div>
            <div className={'ps-3 pe-3 pb-3'}>
                <div className="mt-5">
                    <div className="mt-3">
                        <span className="text2 me-2" style={{ color: "gray" }}>
                            {props.subtitle}<br/>
                        </span>
                        <span className="text1" style={{ fontSize: '1.1rem'}}>
                            {props.subvalue}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}