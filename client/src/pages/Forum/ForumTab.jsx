import { Container } from 'react-bootstrap'
import './Forum.scss'
import { useNavigate } from "react-router";
import { useNav } from "../../contexts/NavContext";


export default function ForumTab({ value, setCurrentDiscussion }) {
    const { _id, title, author, question, createdAt, mostRecent } = { ...value }
    const { addParam } = useNav()

    return (
        <Container fluid className={'border-bottom d-flex flex-row tab'} role={'button'} onClick={() => {
            setCurrentDiscussion(value)
            addParam({'fid': _id})
        }}>
            <Container className={'pt-2 col-9'}>
                <h6 className={'title'}>{title}</h6>
                <p className={'question'}>{question}</p>
            </Container>
            <Container className={'pt-2 col-3'}>
                <p style={{ fontSize: '0.6rem' }}>
                    created At:<br/>{createdAt}
                </p>
                <p style={{ fontSize: '0.6rem' }}>
                    most recent:<br/>{mostRecent}
                </p>
            </Container>
        </Container>
    )
}