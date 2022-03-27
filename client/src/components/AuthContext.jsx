import React, { useContext, useState, useEffect } from "react"

const AuthContext = React.createContext(null)

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(true)

    useEffect(() => {
        (async function () {
            const options = { credentials: 'include' }
            const result = await fetch('http://localhost:8000/login', options)
            setIsLoggedIn(result.status === 200)
        })()
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
        setIsLoggedIn(result.status === 200)
        return result.status === 200
    }

    async function register(data) {
        const options = {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data),
            credentials: 'include',
        }
        const result = await fetch('http://localhost:8000/register', options)
        return result.status === 200
    }

    async function logout() {
        const result = await fetch('http://localhost:8000/logout', { credentials: 'include' })
        setIsLoggedIn(result.status !== 200)
    }

    const value = {
        isLoggedIn,
        login,
        logout,
        register,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}