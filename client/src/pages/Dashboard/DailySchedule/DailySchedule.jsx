import './DailySchedule.scss'
import DailyScheduleItem from "./DailyScheduleItem";
import { Card, Container } from "react-bootstrap";


export default function DailySchedule({ schedule }) {
    let upToDateSchedule = []
    if (schedule) {
        upToDateSchedule = schedule.filter(task => {
            const start = new Date(task.start)
            const today = new Date()
            return today.getMonth() === start.getMonth() && today.getDate() === start.getDate()
        })
    }


    return (
        <Card className="main-card mb-3 overflow-auto" style={{ height: '350px' }}>
            <div className="card-body overflow-auto">
                <p style={{ fontSize: '1em' }}>
                    Today is <strong>{new Date().todayString()}</strong>
                </p>
                {
                    upToDateSchedule.length === 0 ?
                        <p>Your schedule seems to be free today.</p> :
                        <div className="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">
                            {
                                upToDateSchedule.slice(0).map((value, index) => {
                                    const start = new Date(value.start).getTimeString()
                                    const end = new Date(value.end).getTimeString()
                                    const text = value.text
                                    const priority = value.priority
                                    return <DailyScheduleItem key={index} {...{ start, end, text, priority }} />
                                })

                            }
                        </div>
                }
            </div>
        </Card>
    )
}