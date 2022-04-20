import { Container } from "react-bootstrap";
import StudentCourses from "./courses/StudentCourses";
import StudentCoursePage from "./courses/StudentCoursePage";
import { Routes, Route } from 'react-router-dom'
import ForumPage from "./Forum/ForumPage";
import { useEffect } from "react";

import { useCourse } from "../components/CourseContext";

export const courseTabs = ['Material', 'Forum', 'Assignments', 'Groups']

export default function Course() {
    const {updateCourse} = useCourse()

    useEffect(() => {
        return function cleanUp() {
            updateCourse(null)
        }
    }, [])

    return (
        <>
            <Routes>
                <Route path={'/material'} element={<StudentCoursePage />} />
                <Route path={'/forum'} element={<ForumPage />} />
            </Routes>
        </>
    )
}