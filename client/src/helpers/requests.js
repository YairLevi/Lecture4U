const serverAddress = 'http://localhost:8000'

export default class requests {

    makeUrl(path, params={}) {
        const url = new URL(`${serverAddress}${path}`)
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        return url
    }

    static async get(path, params) {
        const url = this.prototype.makeUrl(path, params)
        const options = { credentials: 'include' }
        return await fetch(url, options)
    }

    static async post(path, body, params={}) {
        const url = this.prototype.makeUrl(path, params)
        const options = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(body)
        }
        return await fetch(url, options)
    }

    static async customPost(path, body) {
        const url = this.prototype.makeUrl(path, {})
        const options = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-type' : 'multipart/form-data' },
            body: body
        }
        return await fetch(url, options)
    }
}