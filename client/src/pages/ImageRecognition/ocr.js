import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, ButtonGroup, Container, Card, Nav, Navbar, Modal, Image} from "react-bootstrap"
import './App.css';
import React, {useState} from 'react';
import {Alert, AlertTitle} from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import axios from "axios";
import {List, ListItem} from "@mui/material";
// import {Listbox, ListboxOption} from "@reach/listbox";
// import "@reach/listbox/styles.css";


function Ocr() {

    const [ModalShow, ModalSetShow] = useState(false);
    const [ModalSuccess, SetModalSuccess] = useState(false);
    const [ModalError, SetModalError] = useState(false);
    const [ModalAlertMessage, SetModalAlertMessage] = useState("");
    const [isUpload, setIsUpload] = useState(false);
    const ModalHandleClose = () => ModalSetShow(false);
    const ModalHandleShow = () => ModalSetShow(true);
    let alert_message = ""

    const hiddenFileInputUpload = React.useRef(null);
    const hiddenFileInputTranscript = React.useRef(null);
    let [lstbx_value, setValue] = React.useState("default");

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

    const handleClick = () => {hiddenFileInputUpload.current.click();};

    const handleClickT = () => {hiddenFileInputTranscript.current.click();};

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
            .get(url,{responseType: 'arraybuffer', headers: {'Content-Type': 'application/json'}})
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'text.docx'); //or any other extension
                document.body.appendChild(link);
                link.click();
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
            .get('http://localhost:5000/check_detection',{responseType: 'arraybuffer', headers: {'Content-Type': 'application/json'}})
            .then(res => {
                const img = document.getElementById('col_img');
                img.src = window.URL.createObjectURL(new Blob([res.data]));
            }).catch(err => console.warn(err));
    };

  return (
    <div className="App">
        <Modal show={ModalShow} onHide={ModalHandleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                {ModalSuccess && (<Alert severity="success"><AlertTitle>Uploaded successfully</AlertTitle></Alert>)}
                {ModalError && (<Alert severity="error"><AlertTitle>An Error Occurred</AlertTitle></Alert>)}
            </Modal.Header>
            <Modal.Body><strong>{ModalAlertMessage}</strong></Modal.Body>
            <Modal.Footer><Button variant="secondary" onClick={ModalHandleClose}>Close</Button></Modal.Footer>
        </Modal>
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">Handwriting to Text</Navbar.Brand>
                <Nav className="me-auto">
                    <ButtonGroup aria-label="Basic example">
                        <Button variant="outline-light" onClick={handleClick}>Upload</Button>
                        <input type="file" ref={hiddenFileInputUpload} multiple={false}
                               accept={".png"} onChange={UploadHandleChange} style={{display:'none'}}/>
                        <Button variant="outline-light" onClick={TranscriptHandleChange}>Transcript & Download</Button>
                    </ButtonGroup>
                </Nav>
            </Container>
        </Navbar>
        <Card sx={{maxWidth: 345}}>
            <CardHeader title="Run Demo" />
            Calibrate the system to your handwriting - upload an image through the 'Upload' button above.<br/>
            Then, press the buttons to upload your sample txt, to check the image's identification and run it!
            <ButtonGroup aria-label="Basic example">
                <Button className="button" onClick={handleClickT}>Choose Text File With The Content</Button>
                <input type="file" ref={hiddenFileInputTranscript} multiple={false}
                       accept={".txt"} onChange={UploadTxtHandleChange} style={{display:'none'}}/>
                <br/><p>&emsp;</p><Button className="button"  onClick={GetColImage}>Check Detection</Button>
                <br/><p>&emsp;</p><Button className="button"  onClick={InitTranscriptChange}>Check Accuracy</Button>
            </ButtonGroup>
            <br/>
            <div>
                Change focus of the image's recognition rectangles
                <List value={lstbx_value} onChange={(value) => {setValue(value); handleFocus(value)}}>
                    <ListItem value="175">175%</ListItem>
                    <ListItem value="170">170%</ListItem>
                    <ListItem value="160">160%</ListItem>
                    <ListItem value="150">150%</ListItem>
                    <ListItem value="140">140%</ListItem>
                    <ListItem value="130">130%</ListItem>
                    <ListItem value="125">125%</ListItem>
                    <ListItem value="120">120%</ListItem>
                    <ListItem value="110">110%</ListItem>
                    <ListItem value="100">100%</ListItem>
                    <ListItem value="90">90%</ListItem>
                    <ListItem value="80">80%</ListItem>
                    <ListItem value="75">75%</ListItem>
                    <ListItem value="70">70%</ListItem>
                    <ListItem value="60">60%</ListItem>
                    <ListItem value="50">50%</ListItem>
                    <ListItem value="40">40%</ListItem>
                    <ListItem value="30">30%</ListItem>
                    <ListItem value="25">25%</ListItem>
                </List>
            </div>
        </Card>
        <Card className="image-card" sx={{maxWidth: 345}}><Image id="col_img"/><br/></Card>
        <Card sx={{maxWidth: 345}}><div id="content"></div><br/><div id="accuracy"></div></Card>
    </div>
  );
}

export default Ocr;
