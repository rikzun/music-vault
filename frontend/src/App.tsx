import "./App.style.scss"
import "overlayscrollbars/overlayscrollbars.css"
import axios, { AxiosError } from "axios"
import { Auth } from "@components/common/Auth"
import { SectionSidebar } from "@components/structure/SectionSidebar"
import { SectionPlayer } from "@components/structure/SectionPlayer"
import { SectionPlaylist } from "@components/structure/SectionPlaylist"
import { SettingsAtoms } from "src/atoms/settings"
import { useEffect } from "react"
import { ClientResponse } from "./types/types"
import { ClientAtoms } from "@atoms/client"
import { PopupMenuProvider } from "@components/structure/PopupMenu"
import { LocalStorage } from "@utils/localStorage"
import { Accumulator } from "@utils/accumulator"
import { MenuAtoms } from "@atoms/menu"
import { getDefaultStore } from "jotai"

axios.defaults.baseURL = ENV.APP_URL + "api"

export const bufferAddTrack = new Accumulator<number, number>({
    delayMs: 700,
    action(items, playlistID) {
        axios.post(`playlist/${playlistID}/add-track`, { data: items })
    }
})

export const bufferRemoveTrack = new Accumulator<number, number>({
    delayMs: 700,
    action(items, playlistID) {
        console.log("remove", items)
    }
})

export function App() {
    const token = SettingsAtoms.useToken()
    const client = ClientAtoms.useClient()
    axios.defaults.headers["Authorization"] = token.value

    useEffect(() => {
        const interceptorID = axios.interceptors.response
            .use((res) => res, (err: AxiosError) => {
                if (err.response?.status == 401) {
                    LocalStorage.remove("token", "client.id", "client.login")

                    token.set(null)
                    client.set(null)
                }
                
                return Promise.reject(err)
            })

        if (token.value) {
            axios.get<ClientResponse>("client/me").then((res) => {
                LocalStorage.setNumber("client.id", res.data.id)
                LocalStorage.setString("client.login", res.data.login)
                
                client.set(res.data)
            })
        }

        const dragOverListener = (e: DragEvent) => {
            e.preventDefault()
            e.dataTransfer!.dropEffect = "none"

            getDefaultStore().set(MenuAtoms.sidebarMenu, "Upload")
        }

        const dragListener = (e: DragEvent) => {
            e.preventDefault()
        }

        //prevent page from loading file
        document.addEventListener("dragover", dragOverListener)
        document.addEventListener("drop", dragListener)

        return () => {
            axios.interceptors.response.eject(interceptorID)

            document.removeEventListener("dragover", dragOverListener)
            document.removeEventListener("drop", dragListener)
        }
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
