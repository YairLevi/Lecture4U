import { Container } from 'react-bootstrap'
import './Forum.scss'

export default function ForumTab({ value, setCurrentDiscussion }) {
    const {id, title, author, question, createdAt, mostRecent} = {...value}
    return (
        <Container fluid className={'border-bottom d-flex flex-row tab'} role={'button'} onClick={() => {
            setCurrentDiscussion(value)
        }}>
            <Container className={'pt-2 col-9'}>
                <h6 className={'title'}>{title}</h6>
                <p className={'question'}>{question}</p>
            </Container>
            <Container className={'pt-2 col-3'}>
                <p style={{fontSize: '0.6rem'}}>
                    created At:<br/>{createdAt}
                </p>
                <p style={{fontSize: '0.6rem'}}>
                    most recent:<br/>{mostRecent}
                </p>
            </Container>
        </Container>
    )
}