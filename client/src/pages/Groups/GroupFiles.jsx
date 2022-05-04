import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import UploadFiles from "../../modals/UploadFiles";


export default function GroupFiles(props) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Card className={'mb-3'}>
                <Card.Header>
                    <Card.Title>
                        Files
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {
                        props.files.length === 0 ? <Card.Text>No Files.</Card.Text> : <></>
                    }
                    {
                        props.files.map((value, index) => {
                            return <div key={index}>
                                <a href={value.url}>{value.name}</a>
                            </div>
                        })
                    }
                </Card.Body>
                <Card.Footer>
                    <Button onClick={() => setOpen(true)}>
                        Upload
                    </Button>
                </Card.Footer>
            </Card>

            <UploadFiles show={open} onHide={() => setOpen(false)}/>
        </>
    )
}