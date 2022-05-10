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

    static async postMultipart(path, body) {
        const url = this.prototype.makeUrl(path, {})
        const options = {
            method: 'POST',
            credentials: 'include',
            body: body
        }
        return await fetch(url, options)
    }

    static parseParams(location) {
        const obj = {}
        const params = location.search.replace('?', '')
        const pairs = params.split('&')
        for (const pair of pairs) {
            if (!pair) continue
            const keyValue = pair.split('=')
            obj[keyValue[0]] = keyValue[1]
        }
        return obj
    }

    static createParams(keyValuePairs) {
        let search = '?'
        Object.keys(keyValuePairs).forEach(key => {
            search += `${key}=${keyValuePairs[key]}&`
        })
        return search
    }

    static async delete(path, body) {
        const url = this.prototype.makeUrl(path, {})
        const options = {
            credentials: 'include',
            method: 'DELETE',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(body)
        }
        return await fetch(url, options)
    }
}