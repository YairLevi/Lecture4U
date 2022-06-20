import { Card, Row } from "react-bootstrap";
import FileItem from "../../components/FileItem";


export default function AssignmentContent({ files, text }) {
    return (
        <>
            <Card.Text>{text}</Card.Text>
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