import React, { useEffect, useState } from 'react'


export default function useLoadingEffect(callback, dependencies) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async function () {
            setLoading(true)
            await callback()
            setLoading(false)
        })()
    }, dependencies)

    return loading
}