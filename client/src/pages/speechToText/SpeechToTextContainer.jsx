import { Button, Card, Container, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import PropTypes from "prop-types";
import useLocalStorage from "../../hooks/useLocalStorage";


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
    value: PropTypes.number.isRequired,
};


export default function SpeechToTextContainer() {
    const [lang, setLang] = useState(null)
    const [progress, setProgress] = useLocalStorage('progress',0)
    const [isTranscribe, setTranscribe] = useLocalStorage('isTranscribe',false)
    const [transcribe_score, setTranscribe_score] = useLocalStorage('transcribe_score',0)
    const [fileTime, setFileTime] = useLocalStorage('fileTime',0)

    useEffect(() => {
        console.log(lang)
    }, [lang])

    return (
        <Container className={'p-3'}>
            <h3 style={{ fontWeight: "normal" }}>Speech To Text</h3>
            <Container className={'d-flex mt-5'}>
                <p className={'me-5'}>Choose a language</p>
                <Form>
                    {
                        ['English', 'Hebrew'].map((value, index) => (
                            <Form.Check
                                onChange={() => setLang(value)}
                                inline
                                label={value}
                                name={'language'}
                                type={'radio'}
                                id={`inline-radio-${index}`}
                            />
                        ))
                    }
                </Form>
            </Container>
            <Container className={'d-flex mt-3'}>
                <p className={'me-5'}>Upload a file</p>
                <Form>
                    <Form.Control type={'file'}/>
                </Form>
            </Container>
            <Container className={'mt-3'}>
                <Button>Transcribe And Download</Button>
            </Container>
            <Card sx={{ maxWidth: 345 }} className={'mt-5'}>
                <Card.Body>
                    <Typography variant="body1" color="text.secondary">
                        Here, you can follow the transcription process.
                        <br/>
                        You will be able to see what percentage is left until the end.
                        <br/>
                        When done, the transcribed file will be downloaded, and you will get the accuracy.
                    </Typography>

                    <br/>
                    <Box sx={{ width: '100%' }}>
                        {isTranscribe && (<LinearProgressWithLabel value={progress}/>)}

                        {transcribe_score > 0 && (
                            <Typography variant="body1" color="text.secondary">
                                Accuracy = {transcribe_score}
                            </Typography>
                        )}
                    </Box>

                </Card.Body>
            </Card>
        </Container>
    )
}