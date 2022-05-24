import './Timeline.scss'
import TimelineItem from "./TimelineItem";
import { Card, Container } from "react-bootstrap";
import { eventSettings } from "../../helpers/events";


export default function Timeline({ events }) {
    return (
        <Card className="main-card mb-3 overflow-auto" style={{ height: '350px' }}>
            <div className="card-body overflow-auto">
                <div className="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                    {
                        events.slice(0).reverse().map((value, index) => {
                            const time = new Date(value.createdAt).parseEventDate()
                            const color = eventSettings[value.title].color
                            const text = eventSettings[value.title].text.format(...value.args)
                            const title = value.title.replace(new RegExp("_", "g"), ' ')
                            return <TimelineItem key={index} {...{ time, color, text, title }}/>
                        })
                    }
                </div>
            </div>
        </Card>
    )
}