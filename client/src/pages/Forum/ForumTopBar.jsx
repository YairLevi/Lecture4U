import { Container, Button, FormControl } from 'react-bootstrap'


export default function ForumTopBar({ onClick }) {
    return (
        <Container className={'p-1 d-flex border-bottom'}>
            <Button className={'me-1'} onClick={onClick}>New</Button>
            <FormControl placeholder={'Search...'}/>
        </Container>
    )
}