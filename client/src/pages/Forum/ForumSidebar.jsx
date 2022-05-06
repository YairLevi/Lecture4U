import { Container, Spinner } from 'react-bootstrap'
import React, { useEffect } from 'react'
import ForumTab from "./ForumTab";
import ForumTopBar from "./ForumTopBar";
import NewDiscussion from "../../modals/NewDiscussion";
import { useState } from "react";
import requests from "../../helpers/requests";
import { useLocation } from "react-router-dom";


function getStringDate(d) {
    const date = new Date(d)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
}

export default function ForumSidebar({ setCurrentDiscussion, discussions, addDiscussion }) {
    const [openNewDiscussion, setOpenNewDiscussion] = useState(false)
    const [searchValue, setSearchValue] = useState('')


    return (
        <>
            <Container className={'d-flex flex-column h-100'} style={{
                width: '500px'
            }}>
                <ForumTopBar onClick={() => setOpenNewDiscussion(true)} onChange={e => setSearchValue(e.target.value)}/>
                <Container fluid className={'h-100 overflow-auto p-0 me-2'}>
                    {
                            discussions && discussions.slice(0).reverse().map((value, index) => {
                                const condition = value.title.includes(searchValue) || value.question.includes(searchValue)
                                if (!condition) return
                                const createdAt = getStringDate(value.createdAt)
                                const mostRecent = getStringDate(value.mostRecent)
                                return <ForumTab key={index}
                                                 value={{
                                                     _id: value._id,
                                                     author: value.author,
                                                     createdAt: createdAt,
                                                     mostRecent: mostRecent,
                                                     title: value.title,
                                                     question: value.question
                                                 }}
                                                 setCurrentDiscussion={setCurrentDiscussion}
                                />
                            })
                    }
                </Container>
            </Container>

            <NewDiscussion centered show={openNewDiscussion} onHide={() => setOpenNewDiscussion(false)} addDiscussion={addDiscussion}/>
        </>
    )
}