import { createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams, createSearchParams } from "react-router-dom";

const NavContext = createContext(null)

export function useNav() {
    return useContext(NavContext)
}

export default function NavProvider({ children }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams,] = useSearchParams()

    function getCurrentParams() {
        const params = {}
        searchParams.forEach((value, key) => params[key] = value)
        return params
    }

    function siblingNav(path, params={}, keepParams = true) {
        const newPath = location.pathname.split('/').slice(0, -1).join('/') + path
        fullNav(newPath, params, keepParams)
    }

    function relativeNav(path, params={}, keepParams=true) {
        fullNav(location.pathname + path, params, keepParams)
    }

    function fullNav(path, params={}, keepParams=true) {
        const newSearchParams = keepParams ? {...getCurrentParams(), ...params} : params
        navigate({ pathname: path, search: `?${createSearchParams(newSearchParams)}` })
    }

    const value = {
        siblingNav,
        relativeNav,
        fullNav
    }

    return (
        <NavContext.Provider value={value}>
            {children}
        </NavContext.Provider>
    )
}