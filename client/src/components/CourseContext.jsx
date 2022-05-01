import { useState, createContext, useContext, useEffect } from "react";
import requests from "../helpers/requests";
import { useLocation, useParams } from "react-router-dom";

const CourseContext = createContext()

export function useCourse() {
    return useContext(CourseContext)
}

export default function CourseProvider(props) {
    const [course, setCourse] = useState(null)
    const location = useLocation()


    useEffect(() => {
        const list = location.pathname.split('/')
        if (list.includes('course')) setCourse(list[2])
        // const params = requests.parseParams(location)
        // setCourse(id)
    }, [])

    function updateCourse(id) {
        setCourse(id)
    }

    return (
        <CourseContext.Provider value={{ course, updateCourse }}>
            {props.children}
        </CourseContext.Provider>
    )
}
