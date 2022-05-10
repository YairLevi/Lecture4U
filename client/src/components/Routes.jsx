import React from 'react'
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router";


export function PrivateRoute() {
    const { currentUser } = useAuth()
    return currentUser ? <Outlet/> : <Navigate to={'/sign-in'}/>
}

export function PublicRoute() {
    const { currentUser } = useAuth()
    return !currentUser ? <Outlet/> : <Navigate to={'/main'}/>
}