import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.css";
import {Button, ButtonGroup, Container, Modal, Nav, Navbar} from "react-bootstrap";
import MaterialUIPickers from "./TimePicker";
import {TextField, Rating} from "@mui/material";


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

        this.state = {
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
            customDiv: ['div1']
        };
    }

    addNewRow(){
        let cDivs = this.state.customDiv;
        let len = cDivs.length
        let name = 'div' + ++len
        cDivs.push(name)
        this.state.RatingValue.value.push(0)
        this.setState({customDiv: cDivs })
    }

    componentDidMount() {

        // // load event data
        this.setState({
            startDate: "2022-03-07",
            events: [
                {
                    id: 1,
                    text: "Event 1",
                    start: "2022-03-07T10:30:00",
                    end: "2022-03-07T13:00:00"
                },
                {
                    id: 2,
                    text: "Event 2",
                    start: "2022-03-08T09:30:00",
                    end: "2022-03-08T11:30:00",
                    backColor: "#6aa84f"
                },
                {
                    id: 3,
                    text: "Event 3",
                    start: "2022-03-08T12:00:00",
                    end: "2022-03-08T15:00:00",
                    backColor: "#f1c232"
                },
                {
                    id: 4,
                    text: "Event 4",
                    start: "2022-03-06T11:30:00",
                    end: "2022-03-06T14:30:00",
                    backColor: "#cc4125"
                },
            ]
        });
    }

    ModalHandleShow() {
        this.setState({ModalData:{isModalOpen: true}});
    }

    ModalHandleClose() {
        this.setState({ModalData:{isModalOpen: false}});
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
                            </ButtonGroup>
                        </Nav>
                    </Container>
                </Navbar>

                <br/><br/>

                {/*{this.state.ModalData.isModalOpen && <label>{this.state.RatingValue.value}</label>}*/}

                <Modal
                    show={this.state.ModalData.isModalOpen}
                    onHide={this.ModalHandleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        Schedule Your Tasks
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
                                            // value={name}
                                            onChange={()=>{console.log("tal")}}
                                        />
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <MaterialUIPickers/>
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
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.ModalHandleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <div style={styles.wrap}>
                    <div style={styles.left}>
                        <DayPilotNavigator
                            selectMode={"week"}
                            showMonths={2}
                            skipMonths={2}
                            startDate={"2022-03-19"}
                            selectionDay={"2022-03-19"}
                            // onTimeRangeSelected={ args => {
                            //     this.setState({
                            //         startDate: args.day
                            //     });
                            // }}
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
