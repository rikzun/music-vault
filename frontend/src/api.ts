import axios from "axios";
const config: any = {}

type StringRecord = Record<string, string>
type AuthHeader = {Authorization: string} | {}

class BaseRequest {
    protected url: string
    protected query: StringRecord = {}
    protected headers: StringRecord = {}
    protected token: () => AuthHeader = this.getToken
    protected returnOrigin: boolean = false

    constructor(url: string) {
        this.url = config.appHost + url
    }

    protected getToken() {
        const token = localStorage.getItem('cnstr-token')
        return {Authorization: 'Bearer ' + token}
    }

    protected getConfig() {
        return {
            params: this.query,
            headers: {...this.headers, ...this.token()}
        }
    }

    withQuery(query: StringRecord) {
        this.query = query
        return this
    }

    withHeaders(headers: StringRecord) {
        this.headers = headers
        return this
    }

    withToken(token?: string) {
        let object: AuthHeader = {}
        if (token) object = {Authorization: 'Bearer ' + token}

        this.token = () => object
        return this
    }

    getOrigin() {
        this.returnOrigin = true
        return this
    }
}

class BaseRequestWithBody extends BaseRequest {
    protected body: any = {}

    constructor(url: string) { super(url) }

    withBody(body: any) {
        this.body = body
        return this
    }
}

class GETRequest extends BaseRequest {
    constructor(url: string) { super(url) }

    send() {
        const promise = axios.get(this.url, this.getConfig())

        if (this.returnOrigin) return promise
        return promise.then(v => v.data)
    }
}

class POSTRequest extends BaseRequestWithBody {
    constructor(url: string) { super(url) }

    send() {
        const promise = axios.post(this.url, this.body, this.getConfig())

        if (this.returnOrigin) return promise
        return promise.then(v => v.data)
    }
}

class DELETERequest extends BaseRequest {
    constructor(url: string) { super(url) }

    send() {
        const promise = axios.delete(this.url, this.getConfig())

        if (this.returnOrigin) return promise
        return promise.then(v => v.data)
    }
}

export const req = new class {
    get = (url: string) => new GETRequest(url)
    post = (url: string) => new POSTRequest(url)
    delete = (url: string) => new DELETERequest(url)
}()