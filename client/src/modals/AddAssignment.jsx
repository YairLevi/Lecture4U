import { FormControl, Modal } from "react-bootstrap";


export default function AddAssignment() {

    return (
        <Modal>
            <Modal.Header>
                <Modal.Title>
                    Add a New Assignment
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormControl/>
            </Modal.Body>
        </Modal>
    )
}