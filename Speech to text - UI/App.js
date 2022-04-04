import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, ButtonGroup, Container, Card, Nav, Navbar, Modal} from "react-bootstrap"
import './App.css';
import React, {useState, useEffect} from 'react';
import {FormControl, Radio, RadioGroup, Typography} from "@mui/material";
import CustomizedDialogs from "./Dialog";
import RegistrationForm from "./RegistrationForm";
import FixedBottomNavigation from "./Recommendations Forum"

import FormControlLabel from '@mui/material/FormControlLabel';
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';


import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

import { useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import MicIcon from '@mui/icons-material/Mic';
import axios from "axios";
import {Alert, AlertTitle} from "@mui/lab";
// https://blog.logrocket.com/using-the-react-speech-recognition-hook-for-voice-assistance/
// https://github.com/JamesBrill/react-speech-recognition#readme
// https://github.com/JamesBrill/react-speech-recognition/blob/master/docs/API.md#language-string
// https://github.com/devias-io/material-kit-react


// for Course recommendation system:
// https://mui.com/components/bottom-navigation/

let speech_language = "";
let isDisplayAccuracy = false
let file_duration = 0

function LinearProgressWithLabel(props) {
    isDisplayAccuracy = props.value === 100
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 40 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};




function App() {

    // alert message Modal:
    const [ModalShow, ModalSetShow] = useState(false);
    const [ModalSuccess, SetModalSuccess] = useState(false);
    const [ModalError, SetModalError] = useState(false);
    const [ModalAlertMessage, SetModalAlertMessage] = useState("");
    const ModalHandleClose = () => ModalSetShow(false);
    const ModalHandleShow = () => ModalSetShow(true);
    let alert_message = ""


    // for display transcribe score:
    const displayTranscribeScore = () => {
        axios
            .get('http://localhost:5000/transcribe_score')
            .then(res => {
                setTranscribe_score(parseFloat(res.data['transcribe_score']).toFixed(3))
            })
            .catch(err => console.warn(err));
    }

    // for upload button:
    const hiddenFileInput = React.useRef(null);

    // progress bar:
    const [progress, setProgress] = React.useState(0);
    const [isTranscribe, setTranscribe] = React.useState(false);
    const [transcribe_score, setTranscribe_score] = React.useState(0);

    React.useEffect(() => {
        if (!isTranscribe) { return }
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress === 100) {
                    setTranscribe(false)
                    return 0
                } else {
                    return prevProgress + 10
                }
            });
        }, file_duration);
        return () => {
            clearInterval(timer);
        };
    }, [isTranscribe]);


    // React Mic:
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false);
    const microphoneRef = useRef(null);
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return (
            <div className="mircophone-container">
                Browser is not Support Speech Recognition.
            </div>
        );
    }
    const handleListing = () => {
        if (speech_language === "") {
            SetModalAlertMessage("Choose a language! (Hebrew / English)")
            ModalHandleShow()
            SetModalSuccess(false)
            SetModalError(true)
            /// alert("Choose a language! (Hebrew / English)")
            return
        }
        console.log("handleListing!")
        setIsListening(true);
        microphoneRef.current.classList.add("listening");
        SpeechRecognition.startListening({
            continuous: true, language: speech_language="Hebrew" ? 'he' : 'en-US'
        });
    };
    const stopHandle = () => {
        console.log("stopHandle!")
        setIsListening(false);
        microphoneRef.current.classList.remove("listening");
        SpeechRecognition.stopListening();
    };
    const handleReset = () => {
        console.log("handleReset!")
        stopHandle();
        resetTranscript();
    };

    // Choose language - Radio buttons
    const set_speech_to_text_language = (event) => {
        speech_language = event.target.value
        console.log(speech_language)
    };


    // Navbar buttons:

    const handleClick = () => {
        hiddenFileInput.current.click();
        console.log("inside handleClick!")
    };


    // Upload Button func:
    const UploadHandleChange = (event) => {
        console.log("inside UploadHandleChange!")
        const fileUploaded = event.target.files[0];
        let form = new FormData();
        form.append('file', fileUploaded)

        axios
            .post('http://localhost:5000/upload', form)
            .then(res => {
                if (res.data['isUploaded'] === true) {
                    file_duration = (res.data['duration'] * 100)
                    console.log(file_duration)
                    alert_message = "The file: " + res.data['FileName'] + " has been uploaded successfully!"
                    SetModalAlertMessage(alert_message)
                    ModalHandleShow()
                    SetModalSuccess(true)
                    SetModalError(false)
                    /// alert(alert_msg)
                } else {
                    let alert_message = "Unable to upload: " + res.data['FileName']
                    SetModalAlertMessage(alert_message)
                    ModalHandleShow()
                    SetModalSuccess(false)
                    SetModalError(true)
                    /// alert(alert_msg)
                }
            })
            .catch(err => console.warn(err));

        event.target.value = null;
    };

    // Transcribe Button func
    /// https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
    const TranscribeHandleChange = () => {
        if (speech_language === "") {
            SetModalAlertMessage("Choose a language! (Hebrew / English)")
            ModalHandleShow()
            SetModalSuccess(false)
            SetModalError(true)
            /// alert("Choose a language! (Hebrew / English)")
            return
        }

        let url = 'http://localhost:5000/transcribe?language=' + speech_language
        setTranscribe_score(0)
        setTranscribe(true)
        axios
            .get(url,{
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Lecture 1.docx'); //or any other extension
                document.body.appendChild(link);
                link.click();
                displayTranscribeScore()
            })
            .catch(err => console.warn(err));
    };

    // Download Button func
    const DownloadHandleChange = () => {
        axios
            .get('http://localhost:5000/download')
            .then(res => console.log(res))
            .catch(err => console.warn(err));
    };


    return (
        <div className="App">

            {/* alert modal */}
            <Modal
                show={ModalShow}
                onHide={ModalHandleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    {ModalSuccess && (
                        <Alert severity="success">
                            <AlertTitle>Uploaded successfully</AlertTitle>
                        </Alert>
                    )}
                    {ModalError && (
                        <Alert severity="error">
                            <AlertTitle>An Error Occurred</AlertTitle>
                        </Alert>
                    )}
                </Modal.Header>
                <Modal.Body>
                    <strong>{ModalAlertMessage}</strong>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ModalHandleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Speech to Text</Navbar.Brand>
                    <Nav className="me-auto">
                        <ButtonGroup aria-label="Basic example">

                            <Button variant="outline-light" onClick={handleClick}>Upload</Button>
                            <input type="file"
                                   ref={hiddenFileInput}
                                   multiple={false}
                                   accept={".m4a"}
                                   onChange={UploadHandleChange}
                                   style={{display:'none'}}
                            />

                            <Button variant="outline-light" onClick={DownloadHandleChange}>Download</Button>
                            <Button variant="outline-light" onClick={TranscribeHandleChange}>Transcribe</Button>
                            {/*<FileUploader button_name ={"Upload"} button_func={UploadHandleChange}/>*/}
                            {/*<FileUploader button_name ={"Transcribe"} button_func={TranscribeHandleChange}/>*/}
                            {/*<Button variant="outline-light">Transcribe</Button>*/}


                            <CustomizedDialogs>
                                <RegistrationForm/>
                            </CustomizedDialogs>

                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <FormControl sx={{
                                color: "#d3d3d3",
                                "&.Mui-focused": {
                                    color: "#23A5EB"
                                }
                            }}>
                                <RadioGroup row onClick={set_speech_to_text_language}>
                                    <FormControlLabel value="Hebrew" control={<Radio/>} label="Hebrew"/>
                                    <FormControlLabel value="English" control={<Radio />} label="English"/>
                                </RadioGroup>
                            </FormControl>

                        </ButtonGroup>
                    </Nav>
                </Container>
            </Navbar>


            <Card sx={{ maxWidth: 345 }}>
                <CardHeader title="Run Demo" />
                <CardContent>
                    <Typography variant="body1" color="text.secondary">
                        We would like to test your microphone.
                        <br/>
                        Click the microphone button, say a few words,
                        and find the best configuration for your audio.
                    </Typography>
                </CardContent>

                <div className="microphone-wrapper">
                    <div className="microphone-container">
                        <div
                            className="microphone-icon-container"
                            ref={microphoneRef}
                            onClick={handleListing}
                        >
                            <MicIcon/>

                        </div>
                        <div className="microphone-status">
                            {isListening ? "Listening........." : "Click to start Listening"}
                        </div>
                        {isListening && (
                            <button className="microphone-stop btn" onClick={stopHandle}>
                                Stop
                            </button>
                        )}
                    </div>
                    {transcript && (
                        <div className="microphone-result-container">
                            <div className="microphone-result-text">{transcript}</div>
                            <button className="microphone-reset btn" onClick={handleReset}>
                                Reset
                            </button>
                        </div>
                    )}
                </div>
                <br/>
            </Card>


            <Card sx={{ maxWidth: 345 }}>
                <CardHeader title="Live Transcribe & Notification" />
                <CardContent>
                    <Typography variant="body1" color="text.secondary">
                        Here, you can follow the transcription process.
                        <br/>
                        You will be able to see what percentage is left until the end.
                        <br/>
                        When done, the transcribed file will be saved to a system.
                        <br/>
                        By the 'Download' button above you can download the transcribed file,
                        and you can share it with other users by clicking the 'Send' button above.
                    </Typography>

                    <br/>
                    <Box sx={{ width: '100%' }}>
                        {isTranscribe && (<LinearProgressWithLabel value={progress} />)}

                        {isDisplayAccuracy && transcribe_score > 0 && (
                            <Typography variant="body1" color="text.secondary">
                                Accuracy = {transcribe_score}
                            </Typography>
                        )}
                    </Box>

                </CardContent>
            </Card>

            <Card sx={{ maxWidth: 345 }}>
                <CardHeader title="Speech to text Timeline" />
                <CardContent>
                    <Typography variant="body1" color="text.secondary">
                        Your recent actions with Speech to text module.
                    </Typography>


                    <Timeline position="alternate">
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>11.3.2021</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>14.3.2021</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>11.6.2022</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot />
                            </TimelineSeparator>
                            <TimelineContent>21.9.2022</TimelineContent>
                        </TimelineItem>
                    </Timeline>

                </CardContent>
            </Card>

            {/*<FixedBottomNavigation/>*/}


        </div>




    );
}

export default App;



