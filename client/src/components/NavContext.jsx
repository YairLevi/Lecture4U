import React, { useContext } from 'react'
import { useNavigate, useLocation } from "react-router";

const NavContext = React.createContext(null)

export function useNav() {
    return useContext(NavContext)
}

export default function NavProvider({ children }) {
    const nav = useNavigate()
    const location = useLocation()

    function navigate(path) {
        nav(`${location.pathname}${path}`)
    }

    function navigateFull(path) {
        nav(path)
    }

    return (
        <NavContext.Provider value={{ navigate, navigateFull }}>
            {children}
        </NavContext.Provider>
    )
}