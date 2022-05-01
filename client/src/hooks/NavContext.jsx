import { createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import requests from "../helpers/requests";
import { useSearchParams, createSearchParams, useParams } from "react-router-dom";

const NavContext = createContext(null)

export function useNav() {
    return useContext(NavContext)
}

export default function NavProvider({ children }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams,] = useSearchParams()

    function getCurrentParams() {
        const pairs = location.search.replace('?', '').split('&')
        const params = {}
        for (const pair of pairs) {
            const keyValue = pair.split('=')
            params[keyValue[0]] = keyValue[1]
        }
        return params
    }

    function pathFull(path, clearParams = false) {
        const params = clearParams ? '' : location.search
        navigate(path + params)
    }

    function pathRelative(path, clearParams = false) {
        const currentPath = location.pathname;
        const newPath = currentPath + path
        const params = clearParams ? '' : location.search
        navigate(newPath + params)
    }

    function nav(path, params, keepParams = true) {
        const currentParams = getCurrentParams()
        let searchParams = keepParams ? currentParams : {}
        navigate({
            pathname: path,
            search: `?${createSearchParams({ ...searchParams, ...params })}`
        })
    }

    function rnav(path, params, keepParams = true) {
        const currentParams = getCurrentParams()
        const newPath = location.pathname.split('/').slice(0, -1).join('/') + path
        let newSearchParams = keepParams ? currentParams : { state: searchParams.get('state') }
        navigate({
            pathname: newPath,
            search: `?${createSearchParams({ ...newSearchParams, ...params })}`
        })
    }

    function addParam(param) {
        nav(location.pathname, param)
    }

    const value = {
        addParam,
        pathFull,
        pathRelative,
        nav,
        rnav
    }

    return (
        <NavContext.Provider value={value}>
            {children}
        </NavContext.Provider>
    )
}