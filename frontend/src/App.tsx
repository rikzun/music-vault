import { Auth } from '@components/Auth'
import './App.style.scss'
import axios from 'axios'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { tokenAtom } from './atoms/settings'
import { Layout } from '@components/Layout/Layout'

if (ENV.DEV_MODE) {
    axios.defaults.baseURL = ENV.BACKEND_URL
} else {
    axios.defaults.baseURL = window.location.origin + "/api"
}

export function App() {
    const [token, setToken] = useAtom(tokenAtom);

    useEffect(() => {
        const localToken = localStorage['token']
        if (localToken && !token) setToken(localToken)
    }, [])

    return token ? <Layout /> : <Auth />
}
