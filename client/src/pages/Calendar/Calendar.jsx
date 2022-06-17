import React, { Component } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.scss";
import { Button, ButtonGroup, Container, Modal, Nav, Navbar, Spinner } from "react-bootstrap";
import { TextField, Rating } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import Select from "react-select";
import { Alert, AlertTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

/// https://code.daypilot.org/42221/react-weekly-calendar-tutorial
/// https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react


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
        this.resetCalendar = this.resetCalendar.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.deleteGivenRow = this.deleteGivenRow.bind(this);
        this.AlertMessageHandleShow = this.AlertMessageHandleShow.bind(this);
        this.AlertMessageHandleClose = this.AlertMessageHandleClose.bind(this);
        this.getTasks = this.getTasks.bind(this);

        // get start of week
        let d = new Date(Date.now())
        const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -7 : 0)
        d = new Date(d.setDate(diff));
        const year = d.getFullYear()
        let month = d.getMonth()+1
        if (month < 10) month = `0${month}`
        let day = d.getDate()
        if (day < 10) day = `0${day}`

        this.state = {
            loading: false,
            startDate: `${year}-${month}-${day}`,
            viewType: "Week",
            durationBarVisible: false,
            timeRangeSelectedHandling: "Enabled",
            onTimeRangeSelected: async args => {
                const dp = this.calendar;
                const modal = await DayPilot.Modal.prompt("Create a new task:", "Task 1");
                const modal2 = await DayPilot.Modal.prompt("Your Task Priority (Lowest to highest: 1 - 5)", "1");
                let model_priority = Number(modal2.result)

                while (model_priority < 1 || model_priority > 5) {
                    const modal2 = await DayPilot.Modal.prompt("Your Task Priority (Lowest to highest: 1 - 5)", "1");
                    model_priority = Number(modal2.result)
                }

                dp.clearSelection();
                if (!modal.result) {
                    return;
                }
                dp.events.add({
                    start: args.start,
                    end: args.end,
                    id: DayPilot.guid(),
                    text: modal.result,
                    priority: model_priority,
                });
            },
            eventDeleteHandling: "Update",
            onEventClick: async args => {
                const dp = this.calendar;
                const modal = await DayPilot.Modal.prompt("Update task text:", args.e.text());
                if (!modal.result) {
                    return;
                }
                const e = args.e;
                e.data.text = modal.result;
                dp.events.update(e);
            },
            ModalData: {
                isModalOpen: false
            },
            RatingValue: {
                value: [0]
            },
            TaskNames: {
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
            schedulingOptions: [],
            events: [],
            counter: 0,

            AlertMessageModal: {
                isOpen: false,
                message: "",
                header: "",
                isError: false,
                isSuccess: false
            }
        };
    }

    AlertMessageHandleShow() {
        this.setState({ AlertMessageModal: { isOpen: true } })
    }

    AlertMessageHandleClose() {
        this.setState({ AlertMessageModal: { isOpen: false } })
    }

    addNewRow() {
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
        this.setState({ customDiv: cDivs })
    }

    ModalHandleShow() {
        this.setState({ ModalData: { isModalOpen: true } });
    }

    ModalHandleClose() {
        this.setState({ ModalData: { isModalOpen: false } });
    }

    getTime(time) {
        let hour = time.getHours()
        let minutes = (time.getMinutes()) / 60
        return parseFloat((hour + minutes)).toFixed(2)
    }

    sendTaskData() {
        let data = []
        for (let i = 0; i < this.state.TasksTime.length; i++) {
            if (this.state.TaskNames.names[i] === "") {continue}

            data.push({
                start: this.getTime(this.state.TasksTime[i].start),
                end: this.getTime(this.state.TasksTime[i].end),
                priority: (6 - this.state.RatingValue.value[i]),
                task_name: this.state.TaskNames.names[i],
                start_date: moment(this.state.TasksTime[i].start).set('second', 0).format("YYYY-MM-DDTHH:mm:ss"),
                end_date: moment(this.state.TasksTime[i].end).set('second', 0).format("YYYY-MM-DDTHH:mm:ss")
            })
        }
        for (let i = 0; i < this.state.events.length; i++) {
            let dict = this.state.events[i]
            data.push({
                start: this.getTime(dict.start),
                end: this.getTime(dict.end),
                priority: (6 - dict.priority),
                task_name: dict.text,
                start_date: dict.start,
                end_date: dict.end
            })
        }
        this.ModalHandleClose()

        console.log("Data:")
        console.log(data)

        axios
            .post('http://localhost:5002/calendar_task_data', data)
            .then(res => {
                this.setState({
                    counter: (this.state.counter + 1)
                })
                let options = res.data
                let color_list = ["#6aa84f", "#f1c232", "#cc4125", "#0099ff", "#999999", "#ff944d", "#00b3b3"]
                let ScheduleOptions = {}
                let id = 1
                let my_counter = this.state.counter

                Object.entries(options).forEach(function ([key, value]) {
                    let my_events = []
                    for (let i = 0; i < value.length; i++) {
                        let task_dict = value[i]

                        my_events.push({
                            counter: my_counter,
                            id: id++,
                            text: task_dict['task'],
                            start: task_dict['start_date'],
                            end: task_dict['end_date'],
                            priority: task_dict['priority'],
                            backColor: color_list[i % color_list.length]
                        })
                    }
                    ScheduleOptions[parseInt(key)] = my_events
                });

                /// delete the last scheduling options.
                this.setState({
                    schedulingOptions: []
                });
                const keys = Object.keys(ScheduleOptions);
                for (let k in keys) {
                    this.state.schedulingOptions.push({
                        value: ScheduleOptions[k], label: "Scheduling " + k
                    })
                }

                if (Object.keys(ScheduleOptions).length > 0) {
                    this.setState({
                        events: ScheduleOptions[0],
                        UserScheduleOptions: ScheduleOptions
                    });

                } else {
                    this.setState(({
                        AlertMessageModal: {
                            isOpen: true,
                            message: "There is no valid assignment according to the constraints you have set",
                            header: "Unable to satisfy the constraints you have set.",
                            isError: true,
                            isSuccess: false
                        }
                    }))
                }
            })
            .catch(err => console.warn(err));
    }

    saveTasks() {
        axios
            .post('http://localhost:8000/schedule/save_task_scheduling', this.state.events,
                {
                    withCredentials: true
                })
            .then(res => {
                this.setState(({
                    AlertMessageModal: {
                        isOpen: true,
                        message: "Your task scheduling saved, in each time you will enter this page," +
                            " your scheduling will be reload and display in the calendar.",
                        header: "Your task scheduling saved.",
                        isError: false,
                        isSuccess: true
                    }
                }))
            })
            .catch(err => console.warn(err));
    }

    getTasks() {
        this.state.loading = true
        axios
            .get('http://localhost:8000/schedule/get_task_scheduling', {
                withCredentials: true
            })
            .then(res => {
                this.state.loading = false
                this.setState({
                    events: res.data
                })
            })
            .catch(err => console.warn(err));
    }

    TasksHandleChange(selectedOption) {
        console.log(`Option selected:`, selectedOption);
        let counter = selectedOption.value[0]['counter']
        let label = selectedOption.label.split(" ")[1];

        // removed the last scheduling option (the user switch between scheduling options)
        this.state.events = this.state.events.filter(dict => dict['counter'] !== counter)

        // insert the new scheduling option to the event list.
        let buffer1 = this.state.UserScheduleOptions[parseInt(label)]
        let buffer2 = this.state.events
        for (let j = 0; j < buffer1.length; j++) {
            buffer2.push(buffer1[j])
        }
        this.setState({
            events: buffer2
        })

        console.log(this.state.events)

    }

    resetCalendar() {
        this.setState({
            schedulingOptions: [],
            events: [],
            counter: 0
        });
    }

    resetForm() {
        this.setState({
            RatingValue: {
                value: [0]
            },
            TaskNames: {
                names: [""]
            },
            TasksTime: [
                {
                    start: new Date(),
                    end: new Date()
                },
            ],
            customDiv: ['div1'],
        })
    }

    deleteGivenRow(i) {
        let temp = this.state.customDiv.filter((data, idx) => idx !== i)
        for (let j = 0; j < temp.length; j++) {
            temp[j] = 'div' + (j + 1)
        }
        this.setState({
            RatingValue: {
                value: this.state.RatingValue.value.filter((data, idx) => idx !== i)
            },
            TaskNames: {
                names: this.state.TaskNames.names.filter((data, idx) => idx !== i)
            },
            TasksTime: this.state.TasksTime.filter((data, idx) => idx !== i),
            customDiv: temp
        })
    }

    componentDidMount() {
        this.getTasks()
    }


    render() {
        const { ...config } = this.state;
        return (
            <>
                <Navbar className="color-nav" variant="dark">
                    <Container>
                        <Navbar.Brand href="#home">Calendar Schedule</Navbar.Brand>
                        <Nav className="me-auto">
                            <ButtonGroup aria-label="Basic example">
                                <Button variant="outline-light" onClick={this.ModalHandleShow}>Schedule Tasks</Button>
                                <Button variant="outline-light" onClick={this.saveTasks}>Save Tasks</Button>
                                <Button variant="outline-light" onClick={this.resetCalendar}>Reset Calendar</Button>
                            </ButtonGroup>

                            <div className="select_style" style={{ width: '210px' }}>
                                <Select onChange={this.TasksHandleChange} options={this.state.schedulingOptions}
                                        defaultValue={{ label: "Scheduling Options", value: 0 }}/>
                            </div>

                        </Nav>
                    </Container>
                </Navbar>

                <br/><br/>

                {/* Alert Message Modal: */}
                <Modal
                    show={this.state.AlertMessageModal.isOpen}
                    onHide={this.AlertMessageHandleClose}
                    backdrop="static"
                    keyboard={false}>

                    <Modal.Header closeButton>
                        {this.state.AlertMessageModal.isError && (
                            <Alert severity="error">
                                <AlertTitle>{this.state.AlertMessageModal.header}</AlertTitle>
                            </Alert>
                        )}
                        {this.state.AlertMessageModal.isSuccess && (
                            <Alert severity="success">
                                <AlertTitle>{this.state.AlertMessageModal.header}</AlertTitle>
                            </Alert>
                        )}
                    </Modal.Header>

                    <Modal.Body>
                        <strong>{this.state.AlertMessageModal.message}</strong>
                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button variant="secondary" onClick={this.AlertMessageHandleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>


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
                            this.state.customDiv.map((cdiv, i) => (
                                <div className="expense-block" key={cdiv} id="expense-block-`${i}`" data-block={i}>
                                    <br/>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row'
                                    }}>
                                        <IconButton aria-label="delete" size="small" onClick={() => this.deleteGivenRow(i)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                        &nbsp;&nbsp;&nbsp;


                                        <TextField
                                            id="outlined-name"
                                            label="Task Name"
                                            value={this.state.TaskNames.names[i]}
                                            onChange={(event) => {
                                                let newList = this.state.TaskNames.names
                                                newList[i] = event.target.value
                                                this.setState({ TaskNames: { names: newList } })
                                            }}
                                        />
                                        &nbsp;&nbsp;&nbsp;&nbsp;


                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                minutesStep ={30}
                                                ampm={false}
                                                label="Start Date & Time"
                                                value={this.state.TasksTime[i].start.toString()}
                                                onChange={(event) => {
                                                    let newList = this.state.TasksTime
                                                    newList[i].start = event
                                                    this.setState({ TasksTime: newList })
                                                }}
                                                renderInput={(params) => <TextField {...params} />}/>
                                        </LocalizationProvider>

                                        &nbsp;&nbsp;&nbsp;&nbsp;

                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                minutesStep ={30}
                                                ampm={false}
                                                label="End Time"
                                                value={this.state.TasksTime[i].end.toString()}
                                                onChange={(event) => {
                                                    let newList = this.state.TasksTime
                                                    newList[i].end = event
                                                    this.setState({ TasksTime: newList })
                                                }}
                                                renderInput={(params) => <TextField {...params} />}/>
                                        </LocalizationProvider>


                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Rating
                                            name="simple-controlled"
                                            value={this.state.RatingValue.value[i]}
                                            onChange={(event, newValue) => {
                                                let newList = this.state.RatingValue.value
                                                newList[i] = newValue
                                                this.setState({ RatingValue: { value: newList } })
                                            }}
                                        />
                                    </div>

                                </div>))
                        }
                        <br/>

                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button variant="secondary" onClick={this.addNewRow}>Add Task</Button>
                        </div>
                        <br/>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button variant="secondary" onClick={this.resetForm}>Reset</Button>
                        </div>

                    </Modal.Body>
                    <Modal.Footer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                            onTimeRangeSelected={args => {
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

                {
                    this.state.loading && <Container className={'d-flex justify-content-center align-items-center'}>
                        <Spinner className={'m-3'} animation="border"/>
                    </Container>
                }

            </>
        );
    }
}

export default Calendar;
