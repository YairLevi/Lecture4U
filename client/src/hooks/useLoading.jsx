import { useState} from 'react'


export function useLoading(func) {
    const [loading, setLoading] = useState(false)

    async function action() {
        setLoading(true)
        const ret = await func()
        setLoading(false)
        return ret
    }

    return [loading, action]
}