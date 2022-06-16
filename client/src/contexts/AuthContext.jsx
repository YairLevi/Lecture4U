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
        const result = await requests.get('/login')
        if (result.status !== 200) return
        const user = await result.json()
        setCurrentUser(user)
    }, [])

    async function login(email, password) {
        const result = await requests.post('/login', { email, password })
        if (result.status !== 200) return false
        const user = await result.json()
        setCurrentUser(user)
        return true
    }

    async function register(data) {
        const result = await requests.post('/register', data)
        return result.status === 200
    }

    async function logout() {
        const result = await requests.get('/logout')
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