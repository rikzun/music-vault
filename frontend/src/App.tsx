import './App.style.scss'
import axios from 'axios'

axios.defaults.baseURL = window.location.protocol + "//" + window.location.hostname + ":8080" + "/api";

export function App() {
    return <div></div>
}
