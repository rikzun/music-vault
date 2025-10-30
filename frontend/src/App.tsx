import "./App.style.scss"
import "overlayscrollbars/overlayscrollbars.css"
import axios, { AxiosError } from "axios"
import { Auth } from "@components/Auth"
import { SectionSidebar } from "@components/SectionSidebar"
import { SectionPlayer } from "@components/SectionPlayer"
import { SectionPlaylist } from "@components/SectionPlaylist"
import { SettingsAtoms } from "src/atoms/settings"
import { useEffect } from "react"
import { ClientResponse } from "./common/types"
import { ClientAtoms } from "@atoms/client"
import { PopupMenuProvider } from "@components/PopupMenu"
import { LocalStorage } from "@utils/localStorage"

axios.defaults.baseURL = ENV.APP_URL + "api"

export function App() {
    const token = SettingsAtoms.useToken()
    const client = ClientAtoms.useClient()
    axios.defaults.headers["Authorization"] = token.value

    useEffect(() => {
        axios.interceptors.response.use((res) => res, (err: AxiosError) => {
            if (err.response?.status !== 401) return Promise.reject(err)
            console.log("any method returned 401")

            LocalStorage.remove("token")
            LocalStorage.remove("client.id")
            LocalStorage.remove("client.login")
            token.set(null)
            client.set(null)
            
            return Promise.reject(err)
        })

        if (axios.defaults.headers["Authorization"] != null) {
            axios.get<ClientResponse>("client/me").then((res) => {
                LocalStorage.setNumber("client.id", res.data.id)
                LocalStorage.setString("client.login", res.data.login)
                client.set(res.data)
            })
        }

        //prevent page from loading file
        document.addEventListener("dragover", (e) => {
            e.preventDefault()
            e.dataTransfer!.dropEffect = "none"
        })
        
        document.addEventListener("drop", (e) => {
            e.preventDefault()
        })
    }, [])

    if (token.value == null) return <Auth />

    return (
        <PopupMenuProvider>
            <SectionSidebar />
            <SectionPlayer />
            <SectionPlaylist />
        </PopupMenuProvider>
    )
}
