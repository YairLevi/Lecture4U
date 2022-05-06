import { Container } from "react-bootstrap";
import { Routes, Route } from 'react-router-dom'
import ForumPage from "../Forum/ForumPage";
import { useEffect } from "react";
import Members from "../Members/Members";
import Assignments from "../Assignments/Assignments";
import { useSearchParams } from "react-router-dom";
import Material from "../Material/Material";
import TeacherAssignmentView from "../Assignments/TeacherAssignmentView";
import SubmissionView from "../Assignments/SubmissionView";

export const courseTabs = ['Material', 'Forum', 'Assignments', 'Members']

export default function Course() {
    return (
        <Routes>
            <Route path={'/material'} element={<Material/>}/>
            <Route path={'/forum'} element={<ForumPage/>}/>
            <Route path={'/members'} element={<Members/>}/>
            <Route path={'/assignments'} element={<Assignments/>}/>
            <Route path={'/assignments/:assignmentId'} element={<SubmissionView/>}/>
        </Routes>
    )
}