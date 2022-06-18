import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonGroup, Container, Card, Nav, Navbar, Modal, Image, Dropdown, Spinner } from "react-bootstrap"
import React, { useState } from 'react';
import { Alert, AlertTitle } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import axios from "axios";
import requests from "../../helpers/requests";
import { useLoading } from "../../hooks/useLoading";


export default function Ocr() {
    const focusLevels = [25, 30, 40, 50, 60, 70, 75, 80, 90, 100, 110, 120, 125, 130, 140, 150, 160, 170, 175]
    const [ModalShow, ModalSetShow] = useState(false);
    const [focusLevel, setFocusLevel] = useState(100)
    const [ModalSuccess, SetModalSuccess] = useState(false);
    const [ModalError, SetModalError] = useState(false);
    const [ModalAlertMessage, SetModalAlertMessage] = useState("");
    const [isUpload, setIsUpload] = useState(false);
    const ModalHandleClose = () => ModalSetShow(false);
    const ModalHandleShow = () => ModalSetShow(true);
    let alert_message = ""

    const hiddenFileInputUpload = React.useRef(null);
    const hiddenFileInputTranscript = React.useRef(null);

    const [myFiles, setMyFiles] = useState([]);
    const [DownloadModal, setDownloadModal] = useState(false);
    const [prevFiles, setPrevFiles] = useState([])


    const [loading, RouteToFiles] = useLoading(async () => {
        await axios
            .get('http://localhost:8000/ocr/get', {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .then(res => {
                setPrevFiles(res.data)
            }).catch(err => console.warn(err));
    })

    const ModalDownloadShow = () => {
        if (prevFiles.length === 0) RouteToFiles()
        setDownloadModal(true);
    }

    const ModalDownloadClose = () => setDownloadModal(false);

    const [currentFile, SetCurrentFile] = useState("");


    const InitTranscriptChange = () => {
        document.getElementById('accuracy').textContent = "Loading...";
        document.getElementById('content').textContent = "";
        axios
            .get('http://localhost:5000/init_transcript')
            .then(res => {
                document.getElementById('content').textContent = res.data['content'];
                document.getElementById('accuracy').textContent = String((100 * parseFloat(res.data['transcript_score'])).toFixed(1)) + "%";
            }).catch(err => console.warn(err));
    };

    const handleClick = () => {
        hiddenFileInputUpload.current.click();
    };

    const handleClickT = () => {
        hiddenFileInputTranscript.current.click();
    };

    const handleFocus = (value) => {
        let form = new FormData();
        form.append('value', value)
        axios
            .post('http://localhost:5000/change_focus', form)
            .then(res => {
                alert_message = "Focus change by " + String(value) + "% has succeeded!"
                SetModalAlertMessage(alert_message)
                ModalHandleShow()
                SetModalSuccess(true)
                SetModalError(false)
                setIsUpload(true)
            }).catch(err => console.warn(err));
    };

    const TranscriptHandleChange = () => {
        if (!isUpload) {
            SetModalAlertMessage("Select a file and then click Transcript!")
            ModalHandleShow()
            SetModalSuccess(false)
            SetModalError(true)
            return
        }
        let url = 'http://localhost:5000/transcript_download'
        axios
            .get(url, { responseType: 'arraybuffer', headers: { 'Content-Type': 'application/json' } })
            .then(async res => {
                const retFile = new Blob([res.data])
                const url = window.URL.createObjectURL(retFile);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', currentFile);
                document.body.appendChild(link);
                link.click();
                const newDate = new Date();
                const datetime = String(newDate.getDate() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getFullYear() + "  " + newDate.getHours() + ":" + newDate.getMinutes());
                myFiles.push({ datetime, currentFile, retFile });
                const formData = new FormData()
                formData.append('files', retFile)
                formData.append('fileName', currentFile)
                await requests.postMultipart('/ocr/save', formData)
            }).catch(err => console.warn(err));
    };

    const UploadHandleChange = (event) => {
        const fileUploaded = event.target.files[0];
        let form = new FormData();
        form.append('file', fileUploaded)
        axios
            .post('http://localhost:5000/upload', form)
            .then(res => {
                if (res.data['isUploaded'] === true) {
                    SetCurrentFile(res.data['FileName'].replace(/\.[^/.]+$/, "") + ".docx");
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
            }).catch(err => console.warn(err));
        event.target.value = null;
    };

    const UploadTxtHandleChange = (event) => {
        const fileUploaded = event.target.files[0];
        let form = new FormData();
        form.append('file', fileUploaded)
        axios
            .post('http://localhost:5000/upload_txt', form)
            .then(res => {
                if (res.data['isUploaded'] === true) {
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
            }).catch(err => console.warn(err));
        event.target.value = null;

    };

    const GetColImage = () => {
        axios
            .get('http://localhost:5000/check_detection', {
                responseType: 'arraybuffer',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => {
                const img = document.getElementById('col_img');
                img.src = window.URL.createObjectURL(new Blob([res.data]));
            }).catch(err => console.warn(err));
    };

    return (
        <Container className={'pb-5 App'}>
            <Modal show={ModalShow} onHide={ModalHandleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    {ModalSuccess && (<Alert severity="success"><AlertTitle>Uploaded successfully</AlertTitle></Alert>)}
                    {ModalError && (<Alert severity="error"><AlertTitle>An Error Occurred</AlertTitle></Alert>)}
                </Modal.Header>
                <Modal.Body><strong>{ModalAlertMessage}</strong></Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={ModalHandleClose}>Close</Button></Modal.Footer>
            </Modal>
            <Modal show={DownloadModal} onHide={ModalDownloadClose} backdrop="static" keyboard={false}>
                <Modal.Header className="modal-header" closeButton><b>My Files</b></Modal.Header>
                <Modal.Body style={{ height: 300, overflow: 'auto' }}>
                    <div className={'d-flex'}>
                        <Button onClick={RouteToFiles}>Refresh List</Button>
                        {loading && <Spinner animation={'border'}/>}
                    </div>
                    {
                        prevFiles && prevFiles.map((value, index) => {
                            return <div key={index} style={{ borderBottom: '1px solid gray' }}>
                                <p>Date: {new Date(value.createdAt).parseEventDate()}</p>
                                <p>Link: <a href={value.file.url[0]}>{value.name}</a></p>
                            </div>
                        })
                    }
                </Modal.Body>
            </Modal>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Handwriting to Text</Navbar.Brand>
                    <Nav className="me-auto">
                        <ButtonGroup aria-label="Basic example">
                            <Button variant="outline-light" onClick={handleClick}>Upload</Button>
                            <input type="file" ref={hiddenFileInputUpload} multiple={false}
                                   accept={".png"} onChange={UploadHandleChange} style={{ display: 'none' }}/>
                            <Button variant="outline-light" onClick={TranscriptHandleChange}>Transcript & Download</Button>
                            <Button variant="outline-light" onClick={ModalDownloadShow}>View my Files</Button>
                        </ButtonGroup>
                    </Nav>
                </Container>
            </Navbar>
            <Card sx={{ maxWidth: 345 }} className={'p-3 mt-4'}>
                <CardHeader title="Run Demo"/>
                Calibrate the system to your handwriting - upload an image through the 'Upload' button above.<br/>
                Then, press the buttons to upload your sample txt, to check the image's identification and run it!
                <ButtonGroup aria-label="Basic example">
                    <Button className="button" onClick={handleClickT}>Choose Text File With The Content</Button>
                    <input type="file" ref={hiddenFileInputTranscript} multiple={false}
                           accept={".txt"} onChange={UploadTxtHandleChange} style={{ display: 'none' }}/>
                    <br/><p>&emsp;</p><Button className="button" onClick={GetColImage}>Check Detection</Button>
                    <br/><p>&emsp;</p><Button className="button" onClick={InitTranscriptChange}>Check Accuracy</Button>
                </ButtonGroup><br/>
                <Dropdown>
                    <Dropdown.Toggle>{focusLevel}%</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            focusLevels.map((value, index) => {
                                return <Dropdown.Item key={index} onClick={e => {
                                    setFocusLevel(value);
                                    handleFocus(value)
                                }}>{value}%</Dropdown.Item>
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </Card>
            <Card className="image-card p-3 mt-4" sx={{ maxWidth: 345 }}><Image id="col_img"/><br/></Card>
            <Card sx={{ maxWidth: 345 }} className={'p-3 mt-4'}><div id="content"></div><br/><div id="accuracy"></div></Card>
        </Container>
    );
}