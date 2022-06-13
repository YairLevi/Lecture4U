import { Dropdown } from "react-bootstrap";
import { Chart } from "react-chartjs-2";
import { useEffect, useReducer, useState } from "react";
import './Slider.scss'
import Slider from "./Slider";


const limitTextStyle = {
    width: 200,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
}


function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}


export default function CourseAccessChart({ access }) {
    const [course, setCourse] = useState()

    const [globalValues, setGlobalValues] = useState()
    const [values, setValues] = useState()

    const [globalLabels, setGlobalLabels] = useState()
    const [labels, setLabels] = useState()

    const [globalMin, setGlobalMin] = useState(0)
    const [min, setMin] = useState(globalMin)

    const [globalMax, setGlobalMax] = useState(0)
    const [max, setMax] = useState(globalMax)

    const [minLabel, setMinLabel] = useState()
    const [maxLabel, setMaxLabel] = useState()

    useEffect(() => {
        if (!course) return
        const newGlobalLabels = Object.keys(access[course])
        const newGlobalValues = Object.values(access[course])
        setGlobalLabels(newGlobalLabels)
        setGlobalValues(newGlobalValues)
        setGlobalMin(0)
        setMin(0)
        setGlobalMax(newGlobalValues.length - 1)
        setMax(newGlobalValues.length - 1)
    }, [course])

    useEffect(() => {
        if (!course) return
        setValues(globalValues.slice(min, max+1))
        setLabels(globalLabels.slice(min, max+1))
        setMinLabel(globalLabels[min])
        setMaxLabel(globalLabels[max])
    }, [min, max, globalValues])


    return <>
        <div>
            <Dropdown>
                <Dropdown.Header>
                    Choose a course
                </Dropdown.Header>
                <Dropdown.Toggle variant={'outline-dark'} style={limitTextStyle} dir={'ltr'}>
                    {course ? course : 'No Course'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        Object.keys(access) && Object.keys(access).map((value, index) => {
                            return <Dropdown.Item key={index} onClick={() => setCourse(value)}>
                                {value}
                            </Dropdown.Item>
                        })
                    }
                </Dropdown.Menu>
            </Dropdown>
        </div>
        <div className={'w-100'}>
            <Chart
                type={"line"}
                data={{
                    labels: labels,
                    datasets: [{
                        label: 'Course Access Count',
                        data: values,
                        backgroundColor: 'rgb(0,121,255)',
                        borderColor: 'rgb(0,121,255)',
                        borderWidth: 1,
                    }],
                }}
                options={{
                    responsive: true,
                    aspectRatio: 1.5,
                    elements: {
                        point: {
                            radius: 1.5,
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Students Accessed To Course Page Per Day',
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        },
                    }
                }}
            />
        </div>
        <div className={'w-100 p-3'}>
            <Slider min={globalMin}
                    max={globalMax}
                    onChange={({ min, max }) => {setMin(min); setMax(max)}}
                    minLabel={minLabel}
                    maxLabel={maxLabel}
            />
        </div>
    </>
}