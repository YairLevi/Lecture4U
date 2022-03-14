import React, { useEffect, useState } from 'react'


export function useFetch(callback) {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        callback()
        setLoading(false)
    }, [])

    return loading
}