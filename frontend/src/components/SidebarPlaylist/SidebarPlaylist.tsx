import "./SidebarPlaylist.style.scss"
import { Button } from "@components/Button"
import { PlaylistAtoms } from "@atoms/playlist"
import { Playlist } from "@components/Playlist"
import { Scrollbar } from "@components/Scrollbar"
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded"
import { Dropdown } from "@components/Dropdown"
import { useRef } from "react"
import { useState } from "@utils/hooks"

export function SidebarPlaylist() {
    const playlist = PlaylistAtoms.usePlaylistID()
    const ref = useRef<HTMLButtonElementN>(null)
    const dropdownOpen = useState<boolean>(false)

    return (
        <div className="section-content section-content__playlists">
            <div className="top">
                <span>Playlists</span>
                <Button.Icon icon={MoreHorizRounded} onClick={() => { dropdownOpen.invert() }} ref={ref} />
                <Dropdown
                    open={dropdownOpen}
                    anchorEl={ref.current}
                    //anchorOrigin={{ horizontal: "right", vertical: "center" }}
                    //transformOrigin={{ horizontal: "left", vertical: "center" }}
                />
            </div>

            <Scrollbar>
                <div className="content">
                    <Playlist onClick={() => playlist.set(0)} />
                </div>
            </Scrollbar>
        </div>
    )
}
