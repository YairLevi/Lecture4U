import { useState } from "react";
import { Button, Card, Modal, NavLink } from "react-bootstrap";
import { Icon } from "../../components/Sidebar/Item";
import useLocalStorage from "../../hooks/useLocalStorage";
import EditSubject from "./modals/EditSubject";
import { useParams } from "react-router";
import ConfirmationModal from "../../modals/ConfirmationModal";
import requests from "../../helpers/requests";
import { Rating } from '@mui/material'
import useLoadingEffect from "../../hooks/useLoadingEffect";
import { useLoading } from "../../hooks/useLoading";
import { useAuth } from "../../contexts/AuthContext";


const toggleStyle = {
    cursor: 'pointer',
    userSelect: 'none'
}

const toggleOnClick = (val, setVal) => {
    if (val === 'none') setVal('block')
    else setVal('none')
}

export default function Subject({ unitId, subjectId, name, text, files, ratings }) {
    const [display, setDisplay] = useState('none')
    const [openEdit, setOpenEdit] = useState(false)
    const [state,] = useLocalStorage('state')
    const isTeacher = state === 'teacher'
    const { currentUser } = useAuth()
    const userRating = ratings.filter(item => item.user == currentUser._id)
    userRating.push({ rating: 0 })
    const [rating, setRating] = useState(userRating[0].rating)
    const [openConfirm, setOpenConfirm] = useState()
    const { id: courseId } = useParams()


    async function deleteSubject() {
        const res = await requests.delete('/course/subject', { unitId, subjectId })
        return res.status === 200
    }

    const loading = useLoadingEffect(async () => {
        const res = await requests.post('/course/rate', { subjectId, rating })
        return res.status === 200
    }, [rating], true)


    function openModal(e) {
        e.stopPropagation()
        setOpenEdit(true)
    }

    return (
        <>
            <Card className={'mb-3 mt-3'}>
                <Card.Header className={'d-flex justify-content-between'}
                             onClick={() => toggleOnClick(display, setDisplay)} style={toggleStyle}>
                    <div className={'d-flex align-items-center'}>
                        <Icon iconClass={'bi-bookmark'}/>
                        <Card.Text as={'h5'} className={'ms-3'}>{name}</Card.Text>
                    </div>
                    {
                        !isTeacher &&
                        <div className={'d-flex align-items-center'}>
                            <p className={'m-0 me-2 p-0'} style={{ color: 'gray' }}>{loading ? 'Saving...' : 'Rate Your Understanding'}</p>
                            <Rating value={rating} onChange={e => setRating(e.target.value)} disabled={loading}/>
                        </div>
                    }
                    {
                        isTeacher &&
                        <div>
                            <Button className={'me-2'} variant={'outline-danger'} onClick={e => {
                                e.stopPropagation()
                                setOpenConfirm(true)
                            }}>Delete</Button>
                            <Button variant={"outline-dark"} onClick={openModal}>Edit</Button>
                        </div>
                    }
                </Card.Header>
                <Card.Body className={`d-${display}`}>
                    {
                        text !== '' &&
                        <Card.Text className={'mb-5'} style={{ whiteSpace: 'pre-wrap' }}>{text}</Card.Text>
                    }
                    {
                        files && files.map((value, index) => (
                            <div key={index}>
                                <a href={value.url}>{value.name}</a>
                            </div>
                        ))
                    }
                </Card.Body>
            </Card>


            <Modal show={openEdit} onHide={() => setOpenEdit(false)}>
                <EditSubject id={subjectId} {...{ name, text, files, unitId }}/>
            </Modal>
            <ConfirmationModal show={openConfirm}
                               onHide={() => setOpenConfirm(false)}
                               text={`delete subject ${name}`}
                               func={deleteSubject}/>
        </>
    )
}