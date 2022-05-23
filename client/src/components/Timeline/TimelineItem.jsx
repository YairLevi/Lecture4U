import './Timeline.scss'


export default function TimelineItem(props) {
    return (
        <div className="vertical-timeline-item vertical-timeline-element">
            <span className="vertical-timeline-element-icon bounce-in">
                <i className="badge badge-dot badge-dot-xl" style={{ backgroundColor: props.color }}> </i>
            </span>
            <div className="vertical-timeline-element-content bounce-in">
                <p className={'timeline-title'}>
                    {props.title.toUpperCase()}
                </p>
                <p>
                    {props.text}
                </p>
                <span className="vertical-timeline-element-date" style={{ whiteSpace: 'pre-wrap' }}>
                    {props.time}
                </span>
            </div>
        </div>
    )
}