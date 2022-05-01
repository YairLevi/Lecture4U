import { Container } from 'react-bootstrap'
import AssignmentTab from "./AssignmentTab";


export default function Assignments() {
    return (
        <>
            <Container>
                <h3>Active:</h3>
                <AssignmentTab/>
                <AssignmentTab/>
                <AssignmentTab/>
            </Container>
            <Container className={'mt-5'}>
                <h3>Submitted:</h3>
            </Container>
        </>
    )
}