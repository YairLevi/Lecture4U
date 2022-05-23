import './Timeline.scss'
import TimelineItem from "./TimelineItem";
import { Card, Container } from "react-bootstrap";
import { eventStrings } from "../../helpers/eventParser";


export default function Timeline({ events }) {
    return (
        <Card className="main-card mb-3 overflow-auto" style={{ height: '350px' }}>
            <div className="card-body overflow-auto">
                <div className="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                    {
                        events.map((value, index) => {
                            const time = new Date(value.createdAt).parseEventDate()
                            const color = eventStrings[value.title].color
                            const text = eventStrings[value.title].text.format(...value.args)
                            const title = value.title
                            return <TimelineItem key={index} {...{ time, color, text, title }}/>
                        })
                    }
                </div>
            </div>
        </Card>
    )
}