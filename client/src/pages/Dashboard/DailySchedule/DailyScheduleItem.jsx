import './DailySchedule.scss'


export default function DailyScheduleItem(props) {
    return (
        <div className="vertical-timeline-item vertical-timeline-element">
            <span className="vertical-timeline-element-icon bounce-in">
                <i className="badge badge-dot badge-dot-xl" style={{
                    backgroundColor: "orange",
                    borderRadius: '10px'
                }}> </i>
            </span>
            <div className="vertical-timeline-element-content bounce-in">
                <p className={'timeline-title'}>
                    {props.text}
                </p>
                <p style={{ fontSize: '1em' }}>
                    Priority: {props.priority}
                </p>
                <span className="vertical-timeline-element-date" style={{ whiteSpace: 'pre-wrap' }}>
                    {props.start}
                    <br/>
                    {props.end}
                </span>
            </div>
        </div>
    )
}