import { Card, Row } from "react-bootstrap";
import FileItem from "../../components/FileItem";


export default function AssignmentContent({ files, text }) {
    return (
        <>
            <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{text}</Card.Text>
            <Row>
            {
                files && files.map((value, index) => (
                    <FileItem {...value} key={index} />
                ))
            }
            </Row>
        </>
    )
}