import React, { useContext, useState } from "react"
import useLoadingEffect from "../hooks/useLoadingEffect";
import requests from "../helpers/requests";

const AuthContext = React.createContext(null)

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)

    const loading = useLoadingEffect(async () => {
        const options = { credentials: 'include' }
        const result = await fetch('http://localhost:8000/login', options)
        if (result.status !== 200) return
        const user = await result.json()
        setCurrentUser(user)
    }, [])

    async function login(email, password) {
        const data = { email, password }
        const options = {
            method: 'POST',
            headers: { 'Content-type': 'application/json', },
            body: JSON.stringify(data),
            credentials: 'include'
        }
        const result = await fetch('http://localhost:8000/login', options)
        if (result.status !== 200) return false
        const user = await result.json()
        setCurrentUser(user)
        return true
    }

    async function register(data) {
        const options = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        }
        const result = await fetch('http://localhost:8000/register', options)
        return result.status === 200
    }

    async function logout() {
        const result = await fetch('http://localhost:8000/logout', { credentials: 'include' })
        if (result.status === 200)
            setCurrentUser(null)
    }

    async function checkIfExists(email) {
        const result = await requests.get('/exist-user', { email })
        return result.status === 200
    }

    async function generateCode(email) {
        const result = await requests.get('/generate-code', { email })
        return result.status === 200
    }

    const value = {
        currentUser,
        loading,
        login,
        logout,
        register,
        checkIfExists,
        generateCode,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}