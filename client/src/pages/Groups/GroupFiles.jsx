import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import UploadFiles from "./modals/UploadFiles";
import FileTab from "../../components/FileTab";
import FileLinkTab from "../../components/FileLinkTab";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { useParams } from "react-router";
import requests from "../../helpers/requests";


export default function GroupFiles(props) {
    const [open, setOpen] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [fileToDelete, setFileToDelete] = useState()
    const { id } = useParams()

    async function deleteFile() {
        const groupId = id
        const fileId = fileToDelete._id
        const res = await requests.delete('/groups/delete-file', { groupId, fileId })
        return res.status === 200
    }

    return (
        <>
            <Card className={'mb-3'}>
                <Card.Header className={'bg-light'} style={{
                    color: "#003aa9",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                }}>
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
                            return <FileLinkTab key={index}
                                                onClick={() => {
                                                    setFileToDelete({ ...value })
                                                    setOpenConfirm(true)
                                                }}
                                                name={value.name}
                                                link={value.url}/>
                        })
                    }
                </Card.Body>
                <Card.Footer style={{
                    backgroundColor: 'white',
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10
                }}>
                    <Button onClick={() => setOpen(true)}>
                        Upload
                    </Button>
                </Card.Footer>
            </Card>

            <UploadFiles show={open} onHide={() => setOpen(false)}/>
            <ConfirmationModal show={openConfirm}
                               onHide={() => setOpenConfirm(false)}
                               text={`delete file: ${fileToDelete && fileToDelete.name}`}
                               func={deleteFile}
            />
        </>
    )
}