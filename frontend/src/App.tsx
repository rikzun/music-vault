import "./App.style.scss"
import "overlayscrollbars/overlayscrollbars.css"
import axios, { AxiosError } from "axios"
import { Auth } from "@components/Auth"
import { SectionSidebar } from "@components/SectionSidebar"
import { SectionPlayer } from "@components/SectionPlayer"
import { SectionPlaylist } from "@components/SectionPlaylist"
import { SettingsAtoms } from "src/atoms/settings"
import { IconContext } from "react-icons"
import { useEffect } from "react"
import { ClientResponse } from "./common/types"
import { ClientAtoms } from "@atoms/client"

axios.defaults.baseURL = ENV.APP_URL + "api"

export function App() {
    const token = SettingsAtoms.useToken()
    const client = ClientAtoms.useClient()
    axios.defaults.headers["Authorization"] = token.value

    useEffect(() => {
        axios.interceptors.response.use((res) => res, (err: AxiosError) => {
            if (err.response?.status !== 401) return Promise.reject(err)
            console.log("any method returned 401")

            localStorage.removeItem("token")
            localStorage.removeItem("client.id")
            localStorage.removeItem("client.login")
            token.set(null)
            client.set(null)
            
            return Promise.reject(err)
        })

        if (axios.defaults.headers["Authorization"] != null) {
            axios.get<ClientResponse>("client/me").then((res) => {
                localStorage.setItem("client.id", res.data.id.toString())
                localStorage.setItem("client.login", res.data.login)
                client.set(res.data)
            })
        }
    }, [])

    if (token.value == null) return <Auth />

    return (
        <IconContext.Provider value={{ size: "24" }}>
            <SectionSidebar />
            <SectionPlayer />
            <SectionPlaylist />
        </IconContext.Provider>
    )
}
