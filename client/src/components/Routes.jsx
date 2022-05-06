import React from 'react'
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router";


export function PrivateRoute() {
    const { isLoggedIn } = useAuth()
    return isLoggedIn ? <Outlet/> : <Navigate to={'/sign-in'}/>
}

export function PublicRoute() {
    const { isLoggedIn } = useAuth()
    return !isLoggedIn ? <Outlet/> : <Navigate to={'/main'}/>
}