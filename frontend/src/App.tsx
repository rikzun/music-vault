import "./App.style.scss"
import "overlayscrollbars/overlayscrollbars.css"
import axios, { AxiosError } from "axios"
import { Auth } from "@components/Auth"
import { SectionSidebar } from "src/structure/SectionSidebar"
import { SectionPlayer } from "src/structure/SectionPlayer"
import { SectionPlaylist } from "src/structure/SectionPlaylist"
import { SettingsAtoms } from "src/atoms/settings"
import { useEffect } from "react"
import { ClientResponse } from "./types/types"
import { ClientAtoms } from "@atoms/client"
import { PopupMenuProvider } from "src/structure/PopupMenu"
import { LocalStorage } from "@utils/localStorage"


export function App() {
    const token = SettingsAtoms.useToken()
    const client = ClientAtoms.useClient()

    useEffect(() => {
        axios.defaults.baseURL = ENV.APP_URL + "api"

        axios.interceptors.response.use((res) => res, (err: AxiosError) => {
            if (err.response?.status == 401) {
                LocalStorage.remove("token")
                LocalStorage.remove("client.id")
                LocalStorage.remove("client.login")

                token.set(null)
                client.set(null)
            }
            
            return Promise.reject(err)
        })

        if (token.value) {
            axios.defaults.headers["Authorization"] = token.value

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
