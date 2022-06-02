import './DailySchedule.scss'
import DailyScheduleItem from "./DailyScheduleItem";
import { Card, Container } from "react-bootstrap";
import { eventSettings } from "../../../helpers/events";


export default function DailySchedule({ schedule }) {
    console.log(schedule)

    return (
        <Card className="main-card mb-3 overflow-auto" style={{ height: '350px' }}>
            <div className="card-body overflow-auto">
                <div className="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                    {
                        schedule.slice(0).map((value, index) => {
                            const start = new Date(value.start).getTimeString()
                            const end = new Date(value.end).getTimeString()
                            const text = value.text
                            const priority = value.priority
                            return <DailyScheduleItem key={index} {...{ start, end, text, priority }} />
                        })
                    }
                </div>
            </div>
        </Card>
    )
}