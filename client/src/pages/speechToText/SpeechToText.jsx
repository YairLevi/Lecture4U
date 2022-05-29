import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, ButtonGroup, Container, Card, Nav, Navbar, Modal} from "react-bootstrap"
import React, {useState, useEffect} from 'react';
import {FormControl, Radio, RadioGroup, Typography} from "@mui/material";
import CustomizedDialogs from "./Dialog";
import RegistrationForm from "./RegistrationForm";
// import FixedBottomNavigation from "./Recommendations Forum"

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
import {Alert, AlertTitle} from '@mui/material';
import useLocalStorage from "../../hooks/useLocalStorage";
import moment from "moment";

// https://blog.logrocket.com/using-the-react-speech-recognition-hook-for-voice-assistance/
// https://github.com/JamesBrill/react-speech-recognition#readme
// https://github.com/JamesBrill/react-speech-recognition/blob/master/docs/API.md#language-string
// https://github.com/devias-io/material-kit-react


// for Course recommendation system:
// https://mui.com/components/bottom-navigation/

function LinearProgressWithLabel(props) {
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

export default function SpeechToText() {

    // alert message Modal:
    const [ModalShow, ModalSetShow] = useState(false);
    const [ModalSuccess, SetModalSuccess] = useState(false);
    const [ModalError, SetModalError] = useState(false);
    const [ModalAlertMessage, SetModalAlertMessage] = useState("");
    const [isUpload, setIsUpload] = useState(false);
    const ModalHandleClose = () => ModalSetShow(false);
    const ModalHandleShow = () => ModalSetShow(true);
    let alert_message = ""

    // timeline speech to text:
    const [TimeLineData, setTimeLineData] = useState([]);
    const [displayTimeLineInfo, setDisplayTimeLineInfo] = useState(false);
    const TimeLineModalHandleClose = () => setDisplayTimeLineInfo(false);
    const TimeLineModalHandleShow = () => setDisplayTimeLineInfo(true);
    const [TimeLineIndex, setTimeLineIndex] = useState(-1);
    let TimeLineInfo = []


    // for upload button:
    const hiddenFileInput = React.useRef(null);

    // progress bar:
    const [progress, setProgress] = useLocalStorage('progress',0)
    const [isTranscribe, setTranscribe] = useLocalStorage('isTranscribe',false)
    const [transcribe_score, setTranscribe_score] = useLocalStorage('transcribe_score',0)
    const [fileTime, setFileTime] = useLocalStorage('fileTime',0)

    // radio buttons (speech to text language)
    const [speech_language, setSpeechLanguage] = useLocalStorage('speech_language',"")

    // Reload the page:
    // window.onbeforeunload = function() {
    //     console.log("You Reload The Page!")
    //     localStorage.setItem('time', JSON.stringify(moment(new Date(),"YYYY-MM-DDTHH:mm:ss")))
    //     return true;
    // };

    // add event listener to local storage:
    useEffect(() => {
        function listenForStorage() {
            console.log("inside listenForStorage()")
            const progress = localStorage.getItem('progress')
            const isTranscribe = localStorage.getItem('isTranscribe')
            const transcribe_score = localStorage.getItem('transcribe_score')
            const flag = isTranscribe === "true"

            if (progress && isTranscribe && transcribe_score) {
                setProgress(parseInt(progress))
                setTranscribe(flag)
                setTranscribe_score(parseFloat(transcribe_score))
            }
        }
        window.addEventListener('storage', listenForStorage)
        return () => {
            window.removeEventListener('storage', listenForStorage)
        }
    }, [])

    // Save the time when the user Left the page:
    useEffect(() => {
        return () => {
            console.log("You Left The Page!")
            localStorage.setItem('time', JSON.stringify(moment(new Date(),"YYYY-MM-DDTHH:mm:ss")))
        }
    }, [])

    // Save the time when the user return to the page, and also get TimeLine data from DB.
    React.useEffect(() => {
        (async function () {
            // calculate the current progress bar
            if (isTranscribe) {
                let last_time = JSON.parse(localStorage.getItem('time'))
                let current_time = moment(new Date(),"YYYY-MM-DDTHH:mm:ss")
                let seconds = Math.round(moment.duration(current_time.diff(last_time)).asSeconds())
                let milliseconds = seconds * 1000
                let newProgress = progress + (10 * Math.round((milliseconds / fileTime)))
                setProgress(newProgress)
                console.log("new progress bar:")
                console.log(newProgress)
            }

            // get TimeLine Data from DB.
            const res = await axios.get('http://localhost:8000/speech/get', { withCredentials: true })
            console.log(res)
            setTimeLineData(res.data[0])
        })()

    }, []);

    // Progress bar calculations:
    React.useEffect(() => {
        if (!isTranscribe) { return }

        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress === 100) {
                    return 100
                } else {
                    return prevProgress + 10
                }
            });
        }, fileTime);

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
        console.log("handleListing!")

        if (speech_language === "") {
            SetModalAlertMessage("Choose a language! (Hebrew / English)")
            ModalHandleShow()
            SetModalSuccess(false)
            SetModalError(true)
            return
        }

        setIsListening(true);
        microphoneRef.current.classList.add("listening");

        let flag = ''
        if (speech_language === "Hebrew") {
            flag = 'he'
        } else {
            flag = 'en-US'
        }
        SpeechRecognition.startListening({
            continuous: true, language: flag
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
        setSpeechLanguage(event.target.value)
        console.log(event.target.value)
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
            .post('http://localhost:5001/upload', form)
            .then(res => {
                if (res.data['isUploaded'] === true) {
                    let time = (res.data['duration'] * 100) / 2
                    setFileTime(time)
                    console.log(fileTime)
                    alert_message = "The file: " + res.data['FileName'] + " has been uploaded successfully!"
                    SetModalAlertMessage(alert_message)
                    ModalHandleShow()
                    SetModalSuccess(true)
                    SetModalError(false)
                    setIsUpload(true)
                } else {
                    let alert_message = "Unable to upload: " + res.data['FileName']
                    SetModalAlertMessage(alert_message)
                    ModalHandleShow()
                    SetModalSuccess(false)
                    SetModalError(true)
                    setIsUpload(false)
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
            return
        } else if (!isUpload) {
            SetModalAlertMessage("Select a file and then click Transcript!")
            ModalHandleShow()
            SetModalSuccess(false)
            SetModalError(true)
            return
        }

        let url = 'http://localhost:5001/transcribe?language=' + speech_language
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
                let temp_list = TimeLineData
                let keys = []
                let dictionary = {}

                /// get list of the keys:
                temp_list.forEach(function (dict) {
                    Object.keys(dict).forEach(function (key) {
                        keys.push(key)
                    })
                })

                /// check if the key exist:
                let key = res.headers['transcribe-date']
                if (!keys.includes(key)) {
                    dictionary[key] = [[res.headers['transcribe-file-name'],key,res.headers['transcribe-score']]]
                    temp_list.push(dictionary)
                } else {
                    let index = keys.indexOf(key)
                    temp_list[index][key].push([res.headers['transcribe-file-name'],key,res.headers['transcribe-score']])
                }

                setTimeLineData(temp_list)
                localStorage.setItem('isTranscribe', JSON.stringify(false))
                localStorage.setItem('transcribe_score', JSON.stringify(parseFloat(res.headers['transcribe-score'])))
                localStorage.setItem('progress', JSON.stringify(0))
                window.dispatchEvent(new Event('storage'))

                //send TimeLineData to server:
                axios.post("http://localhost:8000/speech/save",{
                    data: TimeLineData
                }, { withCredentials: true })

                let file_name = res.headers['transcribe-file-name'].split(".")[0] + ".docx"
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', file_name); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
            .catch(err => console.warn(err));
    };

    const displayInfo = (i) => {
        setTimeLineIndex(i)
        TimeLineModalHandleShow()
        console.log(TimeLineData[i])
    }

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

                            <Button variant="outline-light" onClick={TranscribeHandleChange}>Transcribe & Download</Button>

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
                                <RadioGroup row onChange={set_speech_to_text_language} value={speech_language}>
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

                        {transcribe_score > 0 && (
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
                        {
                            Object.entries(TimeLineData).map((cdiv,i) => (
                                <TimelineItem className="expense-block" key={cdiv} id="expense-block-`${i}`" data-block={i}>
                                    <TimelineSeparator>
                                        <TimelineDot />
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent><Button variant="text" onClick={()=>{displayInfo(i)}}>{Object.keys(TimeLineData[i])[0]}</Button></TimelineContent>
                                </TimelineItem>
                            ))
                        }
                    </Timeline>

                </CardContent>
            </Card>

            {/* TimeLine Display Info */}
            {TimeLineIndex >= 0 &&
            <Modal
                show={displayTimeLineInfo}
                onHide={TimeLineModalHandleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Alert severity="info">
                        <AlertTitle>Information about your actions with the speech to text module at: <strong>{Object.keys(TimeLineData[TimeLineIndex])[0]}</strong></AlertTitle>
                    </Alert>
                </Modal.Header>
                <Modal.Body>

                    {
                        Object.entries(TimeLineData[TimeLineIndex]).map((cdiv) => (
                            cdiv[1].forEach(function (list,index) {
                                TimeLineInfo.push(
                                    <div key={index}>
                                        <strong>File Name: </strong> {list[0]}
                                        <br/>
                                        <strong>Accuracy: </strong>{list[2]}
                                        <br/><br/>
                                    </div>
                                )
                            })
                        ))

                    }

                    <>{TimeLineInfo}</>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={TimeLineModalHandleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            }

            {/*<FixedBottomNavigation/>*/}


        </div>

    );
}
