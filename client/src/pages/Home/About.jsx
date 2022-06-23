import { Container } from 'react-bootstrap'


export default function About() {
    return (
        <Container className={'p-4'}>
            <h1>About Us</h1>
            <Container>
                <p>
                    We are 3rd year students at Bar-ilan University. We decided that learning must be done in a better way.
                    <br/>
                    Lecture4U will solve problems that many students having when they learn:
                    <br/>
                    Transcribing the lecture and splitting it into topics with timestamps for easier navigation.
                    A smarter way to find the specific subjects you want to repeat.
                    <br/>
                    Trnscripting an image of human handwriting will solve the problem of an unclear handwriting and let the student focus on the content and not its visualization.
                    <br/>
                    Scheduling your assignments will help managing better your time and your chores by urgence.
                    <br/>
                    Not only these tools, but also rating the lectures by your understanding (or to view the rates as a lecturer).
                    <br/>
                    Lecture4U also supports forums with the lecturers about any subject or unit in the course and having special learning groups with chat and a shared document for a joint editing.
                    <br/>
                    If you want to LEARN more, in easier and more efficient way, join us in Lecture4U!
                    <br/><br/><br/><br/><br/><br/>
                    <i style={{ fontSize: '2.5rem', fontFamily: 'Arial' }}>
                        "We want students to do absolutely nothing other than learn.<br/>
                        Keeping up with courses, material, or scheduling is nor what a students should do,
                        neither is is what teachers should do other than teaching."
                        <p>- James Smith, a teacher on Lecture4U</p>
                    </i>
                    <br/><br/><br/><br/><br/><br/>
                </p>
            </Container>
        </Container>
    )
}