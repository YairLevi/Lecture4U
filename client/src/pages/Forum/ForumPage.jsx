import { Container } from 'react-bootstrap'
import ForumSidebar from "./ForumSidebar";
import ForumDiscussion from "./ForumDiscussion";
import NewDiscussion from "../../modals/NewDiscussion";
import { useState } from "react";


export default function ForumPage() {
    const [currentDiscussion, setCurrentDiscussion] = useState(null)

    return (
        <Container fluid className={'h-100 d-flex p-0'}>
            <ForumSidebar setCurrentDiscussion={setCurrentDiscussion} />
            <ForumDiscussion currentDiscussion={currentDiscussion} />
        </Container>
    )
}