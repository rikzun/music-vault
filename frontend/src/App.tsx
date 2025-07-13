import "./App.style.scss"
import 'overlayscrollbars/overlayscrollbars.css'
import axios from "axios"
import { Auth } from "@components/Auth"
import { SidebarSection } from "@components/SidebarSection"
import { PlayerSection } from "@components/PlayerSection"
import { PlaylistSection } from "@components/PlaylistSection"
import { useTokenAtom } from "src/atoms/settings"
import { IconContext } from "react-icons"

axios.defaults.baseURL = ENV.BACKEND_URL

export function App() {
    const token = useTokenAtom()

    if (token.value == null) return <Auth />
    axios.defaults.headers["Authorization"] = token.value

    return (
        <IconContext.Provider value={{ size: "24" }}>
            <SidebarSection />
            <PlayerSection />
            <PlaylistSection />
        </IconContext.Provider>
    )
}
