import { Container } from 'react-bootstrap'


export default function About() {
    return (
        <Container className={'p-4'}>
            <h1>About Us</h1>
            <Container>
                <p>
                    We are Tal Sigman, Yair Levi, and Noam Roth, and we are 3rd year students at Bar-ilan University.
                    <br/>

                </p>
            </Container>
        </Container>
    )
}