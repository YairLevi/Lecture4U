import React, { useEffect, useState } from 'react'


export default function useLoadingEffect(callback, dependencies, excludeFirst=false) {
    const [loading, setLoading] = useState(!excludeFirst)
    const [check, setCheck] = useState(true)

    useEffect(() => {
        if (check && excludeFirst) {
            setCheck(false)
            return
        }
        (async function () {
            setLoading(true)
            await callback()
            setLoading(false)
        })()
    }, dependencies)

    return loading
}