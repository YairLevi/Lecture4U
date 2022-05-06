import React, { useEffect, useState } from 'react'


export default function useLoader(callback) {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        callback()
        setLoading(false)
    }, [])

    return loading
}