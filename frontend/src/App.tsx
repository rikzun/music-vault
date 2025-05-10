import { Auth } from '@components/Auth';
import './App.style.scss'
import axios from 'axios'

if (ENV.DEV_MODE) {
    axios.defaults.baseURL = 'http://localhost:8080/api'
} else {
    axios.defaults.baseURL = window.location.origin + "/api"
}

export function App() {
    return <Auth></Auth>
}
