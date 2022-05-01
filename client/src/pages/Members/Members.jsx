import { Container } from 'react-bootstrap'
import requests from "../../helpers/requests"
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router'


export default function Members() {
    const [members, setMembers] = useState()
    const location = useLocation()

    useEffect(() => {
        (async function() {
            const params = requests.parseParams(location)
            const res = await requests.get('/course/members', { courseId: params.courseId })
            const data = await res.json()
            setMembers(data)
        })()
    }, [])

    return (
        <Container>
            <h3>Students:</h3>
            {
                members ?
                    members.map((value, index) => {
                        return <p key={index}>{value}</p>
                    })
                    :
                    <p>No members of this course</p>
            }
        </Container>
    )
}