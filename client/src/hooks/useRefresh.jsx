export function useRefresh() {
    function refresh() {
        window.location.reload(false)
    }
    return refresh
}