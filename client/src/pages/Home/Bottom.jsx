import { Container } from "react-bootstrap";


export default function HomeBottom() {
    return (
        <Container fluid style={{ backgroundColor: '#e5e5e5' }}
        className={'p-3 d-flex justify-content-center align-items-center'}>
            <p style={{ fontSize: '0.8rem' }}>Ⓒ Lecture4U Inc.</p>
        </Container>
    )
}