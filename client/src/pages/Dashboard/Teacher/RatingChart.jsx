import { Dropdown } from "react-bootstrap";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, registerables} from 'chart.js'
import { useEffect, useState } from "react";

ChartJS.register(...registerables)

const limitTextStyle = {
    width: 200,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
}


export default function RatingChart({ ratings }) {
    const [course, setCourse] = useState()
    const [subject, setSubject] = useState(null)
    const [chartData, setChartData] = useState([0, 0, 0, 0, 0])

    useEffect(() => {
        setSubject(null)
    }, [course])

    useEffect(() => {
        if (!subject) return
        setChartData(Object.values(ratings[course][subject]))
    }, [subject])

    return (
        <>
            <div className={'d-flex'} dir={'rtl'}>
                <Dropdown>
                    <Dropdown.Header>
                        Choose a course
                    </Dropdown.Header>
                    <Dropdown.Toggle variant={'outline-dark'} style={limitTextStyle} dir={'ltr'}>
                        {course ? course : 'No Course'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            Object.keys(ratings).map((value, index) => {
                                return <Dropdown.Item key={index} onClick={() => setCourse(value)}>
                                    {value}
                                </Dropdown.Item>
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown className={'me-3'}>
                    <Dropdown.Header>
                        Choose a subject
                    </Dropdown.Header>
                    <Dropdown.Toggle variant={'outline-dark'} style={limitTextStyle} dir={'ltr'}>
                        {subject ? subject : 'No Subject'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            ratings[course] && Object.keys(ratings[course]).map((value, index) => {
                                return <Dropdown.Item key={index} onClick={() => setSubject(value)}>
                                    {value}
                                </Dropdown.Item>
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <Chart type={"bar"}
                   data={{
                       labels: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
                       datasets: [{
                           label: 'Hide Chart',
                           data: chartData,
                           backgroundColor: [
                               'rgba(255, 99, 132, 1.0)',
                               'rgba(255,180,32,0.6)',
                               'rgba(248,255,27,0.6)',
                               'rgba(155,255,16,0.6)',
                               'rgba(64,255,0,0.6)',
                           ],
                           borderColor: [
                               'rgb(159,62,83)',
                               'rgb(162,115,21)',
                               'rgb(151,155,21)',
                               'rgb(100,162,13)',
                               'rgb(34,134,0)',
                           ],
                           borderWidth: 1
                       }],
                   }}
                   options={{
                       responsive: true,
                       aspectRatio: 1.8,
                       plugins: {
                           title: {
                               display: true,
                               text: 'How Well Did Your Students Understand The Subjects?',
                           },
                           legend: {
                               display: false,
                           }
                       },
                       scales: {
                           y: {
                               beginAtZero: true
                           }
                       }
                   }}
            />
        </>
    )
}