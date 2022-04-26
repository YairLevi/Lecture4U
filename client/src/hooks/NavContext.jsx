import { createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import requests from "../helpers/requests";


const NavContext = createContext(null)

export function useNav() {
    return useContext(NavContext)
}

export default function NavProvider({ children }) {
    const location = useLocation()
    const navigate = useNavigate()

    function pathFull(path, clearParams=false) {
        const params = clearParams ? '' : location.search
        navigate(path + params)
    }

    function pathRelative(path, clearParams=false) {
        const currentPath = location.pathname;
        const newPath = currentPath + path
        const params = clearParams ? '' : location.search
        navigate(newPath + params)
    }

    function addParam(key, value) {
        const params = requests.parseParams(location)
        params[key] = value
        const newParams = requests.createParams(params)
        const path = location.pathname + newParams
        navigate(path)
    }

    const value = {
        addParam,
        pathFull,
        pathRelative
    }

    return (
        <NavContext.Provider value={value}>
            {children}
        </NavContext.Provider>
    )
}