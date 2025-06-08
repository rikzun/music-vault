import { Auth } from '@components/Auth'
import './App.style.scss'
import axios from 'axios'

if (ENV.DEV_MODE) {
    axios.defaults.baseURL = ENV.BACKEND_URL
} else {
    axios.defaults.baseURL = window.location.origin + "/api"
}

export function App() {
    return <Auth></Auth>
}
