import { useCallback, useState } from "react";


export function useRefresh() {
    const [, updateState] = useState()
    return useCallback(() => updateState({}), [])
}