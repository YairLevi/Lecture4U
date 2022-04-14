import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.css";
import {Button, ButtonGroup, Container, Modal, Nav, Navbar} from "react-bootstrap";
import MaterialUIPickers from "./TimePicker";
import {TextField, Rating} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {TimePicker} from "@mui/lab";
import axios from "axios";
import moment from "moment";
import Select from "react-select";


/// https://code.daypilot.org/42221/react-weekly-calendar-tutorial


const styles = {
    wrap: {
        display: "flex"
    },
    left: {
        marginRight: "10px"
    },
    main: {
        flexGrow: "1"
    }
};

class Calendar extends Component {

    constructor(props) {
        super(props);
        this.ModalHandleShow = this.ModalHandleShow.bind(this);
        this.ModalHandleClose = this.ModalHandleClose.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.sendTaskData = this.sendTaskData.bind(this);
        this.saveTasks = this.saveTasks.bind(this);
        this.TasksHandleChange = this.TasksHandleChange.bind(this);

        this.state = {
            startDate : "2022-04-10",
            viewType: "Week",
            durationBarVisible: false,
            timeRangeSelectedHandling: "Enabled",
            onTimeRangeSelected: async args => {
                const dp = this.calendar;
                const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
                dp.clearSelection();
                if (!modal.result) { return; }
                dp.events.add({
                    start: args.start,
                    end: args.end,
                    id: DayPilot.guid(),
                    text: modal.result
                });
            },
            eventDeleteHandling: "Update",
            onEventClick: async args => {
                const dp = this.calendar;
                const modal = await DayPilot.Modal.prompt("Update event text:", args.e.text());
                if (!modal.result) { return; }
                const e = args.e;
                e.data.text = modal.result;
                dp.events.update(e);
            },
            ModalData : {
                isModalOpen : false
            },
            RatingValue : {
                value : [0]
            },
            TaskNames : {
              names: [""]
            },
            TasksTime: [
                {
                    start: new Date(),
                    end: new Date()
                },
            ],
            customDiv: ['div1'],

            UserScheduleOptions: "",
            schedulingOptions: []
        };
    }

    addNewRow(){
        let cDivs = this.state.customDiv;
        let len = cDivs.length
        let name = 'div' + ++len
        cDivs.push(name)
        this.state.RatingValue.value.push(0)
        this.state.TaskNames.names.push("")
        this.state.TasksTime.push({
            start: new Date(),
            end: new Date()
        })
        this.setState({customDiv: cDivs })
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     console.log("inside componentDidUpdate!")
    //     if (prevState && prevState.state && prevState.state.startDate &&  (prevState.state.startDate !== this.state.startDate)) {
    //         /* your setState logic*/
    //     }
    // }

    // componentDidMount() {
    //
    //     // load event data
    //     this.setState({
    //         startDate: this.state.startDate,
    //         events: [
    //             {
    //                 id: 1,
    //                 text: "Event 1",
    //                 start: "2022-03-20T10:30:00",
    //                 end: "2022-03-20T13:00:00"
    //             },
    //             {
    //                 id: 2,
    //                 text: "Event 2",
    //                 start: "2022-03-20T09:30:00",
    //                 end: "2022-03-20T11:30:00",
    //                 backColor: "#6aa84f"
    //             },
    //             {
    //                 id: 3,
    //                 text: "Event 3",
    //                 start: "2022-03-21T12:00:00",
    //                 end: "2022-03-21T15:00:00",
    //                 backColor: "#f1c232"
    //             },
    //             {
    //                 id: 4,
    //                 text: "Event 4",
    //                 start: "2022-03-22T11:30:00",
    //                 end: "2022-03-22T14:30:00",
    //                 backColor: "#cc4125"
    //             },
    //         ]
    //     });
    // }

    ModalHandleShow() {
        this.setState({ModalData:{isModalOpen: true}});
    }

    ModalHandleClose() {
        this.setState({ModalData:{isModalOpen: false}});
    }

    getTime(time) {
        let hour = time.getHours()
        let minutes = (time.getMinutes()) / 60
        return parseFloat((hour + minutes)).toFixed(2)
    }

    sendTaskData() {
        let data = []
        for(let i = 0 ; i < this.state.TasksTime.length;  i++) {
            data.push({
                start : this.getTime(this.state.TasksTime[i].start),
                end : this.getTime(this.state.TasksTime[i].end),
                day : this.state.TasksTime[i].start.getDay(),
                priority :  (6 - this.state.RatingValue.value[i]),
                task_name : this.state.TaskNames.names[i],
                start_date : moment(this.state.TasksTime[i].start).set('second', 0).format("YYYY-MM-DDTHH:mm:ss"),
                end_date : moment(this.state.TasksTime[i].end).set('second', 0).format("YYYY-MM-DDTHH:mm:ss")
            })
        }
        this.ModalHandleClose()

        axios
            .post('http://localhost:5000/calendar_task_data', data)
            .then(res => {
                let options = res.data
                let color_list = ["#6aa84f", "#f1c232", "#cc4125", "#0099ff"]
                let ScheduleOptions = {}
                let id = 1

                Object.entries(options).forEach(function([key,value]) {
                    let my_events = []
                    for (let i = 0; i < value.length; i++) {
                        let task_dict = value[i]
                        my_events.push({
                            id: id++,
                            text: task_dict['task'],
                            start: task_dict['start_date'],
                            end: task_dict['end_date'],
                            backColor: color_list[i % color_list.length]
                        })
                    }
                    ScheduleOptions[parseInt(key)] = my_events
                });

                const keys = Object.keys(ScheduleOptions);
                for (let k in keys) {
                    this.state.schedulingOptions.push({
                        value: ScheduleOptions[k], label: "Scheduling " + k
                    })
                }

                if (Object.keys(ScheduleOptions).length > 0) {
                    this.setState({
                        UserScheduleOptions: ScheduleOptions,
                        startDate: this.state.startDate,
                        events: ScheduleOptions[0]
                    });
                } else {
                    alert("There is no valid assignment according to the constraints you have set")
                }
            })
            .catch(err => console.warn(err));
    }

    saveTasks() {
        axios
            .post('http://localhost:5000/save_task_scheduling', this.state.UserScheduleOptions)
            .then(res => {
                console.log(res)
                alert("Your task scheduling  saved ")
            })
            .catch(err => console.warn(err));
    }

    TasksHandleChange(selectedOption) {
        console.log(`Option selected:`, selectedOption);
        let label = selectedOption.label.split(" ")[1];
        this.setState({
            events: this.state.UserScheduleOptions[parseInt(label)]
        });
    }



    render() {
        const {...config} = this.state;
        return (
            <>
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="#home">Calendar Schedule</Navbar.Brand>
                        <Nav className="me-auto">
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="outline-light" onClick={this.ModalHandleShow}>Schedule Tasks</Button>
                                <Button variant="outline-light" onClick={this.saveTasks}>Save Tasks</Button>
                            </ButtonGroup>

                            <div className="select_style" style={{width: '210px'}}>
                                <Select onChange={this.TasksHandleChange} options={this.state.schedulingOptions} defaultValue={{ label: "Scheduling Options", value: 0 }}/>
                            </div>

                        </Nav>
                    </Container>
                </Navbar>

                <br/><br/>

                <Modal
                    show={this.state.ModalData.isModalOpen}
                    onHide={this.ModalHandleClose}
                    backdrop="static"
                    keyboard={false}
                    size={"lg"}
                >
                    <Modal.Header closeButton>
                        <strong>Schedule Your Tasks</strong>
                    </Modal.Header>
                    <Modal.Body>

                            {
                                this.state.customDiv.map((cdiv, i) => (<div className="expense-block" key={cdiv} id="expense-block-`${i}`" data-block={i}>
                                    <br/>

                                    <div style={{display: 'flex',
                                        flexDirection: 'row'}}>
                                        <TextField
                                            id="outlined-name"
                                            label="Task Name"
                                            value={this.state.TaskNames.names[i]}
                                            onChange={(event) => {
                                                let newList = this.state.TaskNames.names
                                                newList[i] = event.target.value
                                                this.setState({TaskNames:{names: newList}})
                                            }}
                                        />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        {/*<MaterialUIPickers/>*/}


                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                ampm={false}
                                                label="Start Date & Time"
                                                value={this.state.TasksTime[i].start.toString()}
                                                onChange={(event) => {
                                                    let newList = this.state.TasksTime
                                                    newList[i].start = event
                                                    this.setState({TasksTime: newList})
                                                }}
                                                renderInput={(params) => <TextField {...params} />}/>
                                        </LocalizationProvider>

                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                ampm={false}
                                                label="End Time"
                                                value={this.state.TasksTime[i].end.toString()}
                                                onChange={(event) => {
                                                    let newList = this.state.TasksTime
                                                    newList[i].end = event
                                                    this.setState({TasksTime: newList})
                                                }}
                                                renderInput={(params) => <TextField {...params} />}/>
                                        </LocalizationProvider>


                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <Rating
                                            name="simple-controlled"
                                            value={this.state.RatingValue.value[i]}
                                            onChange={(event, newValue) => {
                                                let newList = this.state.RatingValue.value
                                                newList[i] = newValue
                                                this.setState({RatingValue:{value: newList}})
                                            }}
                                        />
                                    </div>

                                </div>))
                            }
                        <br/>

                        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                            <br/>
                            <Button variant="secondary" onClick={this.addNewRow}>Add Task</Button>
                        </div>

                    </Modal.Body>
                    <Modal.Footer style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                            <Button variant="success" onClick={this.sendTaskData}>Approve</Button>
                    </Modal.Footer>
                </Modal>

                <div style={styles.wrap}>
                    <div style={styles.left}>
                        <DayPilotNavigator
                            selectMode={"week"}
                            showMonths={2}
                            skipMonths={2}
                            startDate={this.state.startDate}
                            selectionDay={this.state.startDate}
                            onTimeRangeSelected={ args => {
                                this.setState({
                                    startDate: args.day
                                });
                            }}
                        />
                    </div>
                    <div style={styles.main}>
                        <DayPilotCalendar
                            {...config}
                            ref={component => {
                                this.calendar = component && component.control;
                            }}
                        />
                    </div>
                </div>


            </>
        );
    }
}

export default Calendar;
