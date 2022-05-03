import { useSearchParams } from "react-router-dom";
import TeacherAssignmentView from "./TeacherAssignmentView";
import StudentAssignmentView from './StudentAssignmentView'


export default function Assignments() {
    const [searchParams] = useSearchParams()
    const isTeacher = searchParams.get('state') === 'teacher'

    return isTeacher ? <TeacherAssignmentView/> : <StudentAssignmentView/>
}