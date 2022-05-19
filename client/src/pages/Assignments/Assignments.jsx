import { useSearchParams } from "react-router-dom";
import TeacherAssignmentView from "./TeacherAssignmentView";
import StudentAssignmentView from './StudentAssignmentView'
import useLocalStorage from "../../hooks/useLocalStorage";


export default function Assignments() {
    const [state, ] = useLocalStorage('state')
    const isTeacher = state === 'teacher'

    return isTeacher ? <TeacherAssignmentView/> : <StudentAssignmentView/>
}