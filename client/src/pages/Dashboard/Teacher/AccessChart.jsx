import { Dropdown } from "react-bootstrap";
import { Chart } from "react-chartjs-2";
import { useEffect, useReducer, useState } from "react";
import './Slider.scss'


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
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

const GAP = 30

export default function AccessChart({ access }) {
    const [course, setCourse] = useState()

    const [globalValues, setGlobalValues] = useState()
    const [values, setValues] = useState()

    const [globalLabels, setGlobalLabels] = useState()
    const [labels, setLabels] = useState()

    const [sliderPos, setSliderPos] = useState(0)

    useEffect(() => {
        if (!course) return
        const newGlobalLabels = Object.keys(access[course])
        const newGlobalValues = Object.values(access[course])
        setGlobalLabels(newGlobalLabels)
        setGlobalValues(newGlobalValues)
        setSliderPos(0)
    }, [course])

    useEffect(() => {
        if (!course) return
        const num = parseInt(sliderPos) + GAP
        setValues(globalValues.slice(sliderPos, num))
        setLabels(globalLabels.slice(sliderPos, num))
    }, [sliderPos, globalValues])


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
        {
            globalValues &&
            globalValues.length > GAP &&
            <div className={'w-100 p-3'}>
                <input min={0} max={globalValues.length - GAP} value={sliderPos} onChange={e => setSliderPos(e.target.value)} type={"range"}/>
            </div>
        }
    </>
}