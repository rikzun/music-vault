import "./App.style.scss"
import axios from "axios"
import { Auth } from "@components/Auth"
import { Fragment } from "react"
import { SidebarSection } from "@components/SidebarSection"
import { PlayerSection } from "@components/PlayerSection"
import { PlaylistSection } from "@components/PlaylistSection"
import { useTokenAtom } from "src/atoms/settings"

axios.defaults.baseURL = ENV.BACKEND_URL

export function App() {
    const token = useTokenAtom()

    if (token.value == null) return <Auth />
    return (
        <Fragment>
            <SidebarSection />
            <PlayerSection />
            <PlaylistSection />
        </Fragment>
    )
}
