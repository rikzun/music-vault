import "./App.style.scss"
import axios from "axios"
import { Auth } from "@components/Auth"
import { useEffect } from "react"
import { Layout } from "@components/Layout/Layout"
import { useTokenAtom } from "src/atoms/settings"

if (ENV.DEV_MODE) {
    axios.defaults.baseURL = ENV.BACKEND_URL
} else {
    axios.defaults.baseURL = window.location.origin + '/api'
}

export function App() {
    const token = useTokenAtom()

    useEffect(() => {
        const localToken = localStorage['token']
        if (localToken && !token.value) token.set(localToken)
    }, [])

    return token.value ? <Layout /> : <Auth />
}
