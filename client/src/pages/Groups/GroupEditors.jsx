import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import UploadFiles from "./modals/UploadFiles";
import FileTab from "../../components/FileTab";
import FileLinkTab from "../../components/FileLinkTab";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { useParams } from "react-router";
import requests from "../../helpers/requests";
import NewDocumentModal from "./modals/NewDocumentModal";
import { Link } from "react-router-dom";
import EditorTab from "./EditorTab";


export default function GroupEditors(props) {
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
                <Card.Header>
                    <Card.Title>
                        Shared Editors
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {
                        props.documents.length === 0 ? <Card.Text>No Documents.</Card.Text> : <></>
                    }
                    {
                        props.documents.map((value, index) => {
                            return <EditorTab key={value._id} name={value.name} docId={value._id} onClick={() => {
                                setFileToDelete(value)
                                setOpenConfirm(true)
                            }}/>
                        })
                    }
                </Card.Body>
                <Card.Footer>
                    <Button onClick={() => setOpen(true)}>
                        Add Document
                    </Button>
                </Card.Footer>
            </Card>

            <NewDocumentModal show={open} onHide={() => setOpen(false)}/>
            <ConfirmationModal show={openConfirm}
                               onHide={() => setOpenConfirm(false)}
                               text={`delete file: ${fileToDelete && fileToDelete.name}`}
                               func={deleteFile}
            />
        </>
    )
}