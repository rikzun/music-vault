import "./SectionSidebar.style.scss"
import { UserPanel } from "@components/UserPanel"
import { Button } from "@components/Button"
import { useState } from "@utils/hooks"
import { SidebarUpload } from "@components/SidebarUpload"
import QueueMusicRounded from "@mui/icons-material/QueueMusicRounded"
import PeopleAltRounded from "@mui/icons-material/PeopleAltRounded"
import ForumRounded from "@mui/icons-material/ForumRounded"
import SearchRounded from "@mui/icons-material/SearchRounded"
import DownloadRounded from "@mui/icons-material/DownloadRounded"
import { SidebarPlaylist } from "@components/SidebarPlaylist"

type MenuItems =
    | "Playlists"
    | "Friends"
    | "RoomChat"
    | "Search"
    | "Upload"

export function SectionSidebar() {
    const menu = useState<MenuItems>("Playlists")

    return (
        <div className="section-sidebar">
            <div className="container">
                <div className="buttons">
                    <div className="top">
                        <Button.Menu
                            aria-label="Playlists"
                            icon={QueueMusicRounded}
                            isPressed={menu.value === "Playlists"}
                            onClick={() => menu.set("Playlists")}
                        />

                        <Button.Menu
                            aria-label="Friends"
                            icon={PeopleAltRounded}
                            isPressed={menu.value === "Friends"}
                            onClick={() => menu.set("Friends")}
                        />

                        <Button.Menu
                            aria-label="RoomChat"
                            icon={ForumRounded}
                            isPressed={menu.value === "RoomChat"}
                            onClick={() => menu.set("RoomChat")}
                        />

                        <Button.Menu
                            aria-label="Search"
                            icon={SearchRounded}
                            isPressed={menu.value === "Search"}
                            onClick={() => menu.set("Search")}
                        />
                    </div>

                    <div className="bottom">
                        <Button.Menu
                            aria-label="Upload"
                            icon={DownloadRounded}
                            isPressed={menu.value === "Upload"}
                            onClick={() => menu.set("Upload")}
                        />
                    </div>
                </div>

                {menu.value === "Playlists" && <SidebarPlaylist />}
                {menu.value === "Upload" && <SidebarUpload />}
            </div>

            <UserPanel />
        </div>
    )
}