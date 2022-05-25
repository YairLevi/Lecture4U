import { Card } from "react-bootstrap";


export default function AssignmentContent({ files, text }) {
    return (
        <>
            <Card.Text>{text}</Card.Text>
            {
                files && files.map((value, index) => (
                    <div key={index}>
                        <a href={value.url}>{value.name}</a>
                    </div>
                ))
            }
        </>
    )
}