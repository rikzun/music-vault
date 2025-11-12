import { Button } from "@components/Button"
import { PlaylistAtoms } from "@atoms/playlist"
import { Playlist } from "@components/Playlist"
import { Scrollbar } from "@components/Scrollbar"
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded"
import { EventBus, useState } from "@utils/hooks"
import { FadeMenu } from "@components/FadeMenu"

type Menu = "playlistList" | "playlistCreation"

export function SidebarPlaylist() {
    const menu = useState<Menu>("playlistList")
    const playlistCreationMode = useState(false)
    const playlist = PlaylistAtoms.usePlaylistID()

    EventBus.useListener("playlistCreation", () => {
        playlistCreationMode.invert((newValue) => {
            menu.set("playlistCreation")
        })
    })

    return (
        <div className="section-content section-content__playlists">
            <div className="top">
                <span>Playlists</span>

                <Button.Icon
                    icon={MoreHorizRounded}
                    exPadding={16}
                    data-pmi={{type: "playlists"}}
                />
            </div>

            <FadeMenu type="playlistList" active={menu.value}>
                <Scrollbar>
                    <div className="content">
                        <Playlist onClick={() => playlist.set(0)} />
                    </div>
                </Scrollbar>
            </FadeMenu>

            <FadeMenu type="playlistCreation" active={menu.value}>
                <Scrollbar>
                    <div className="content">
                        
                    </div>
                </Scrollbar>
            </FadeMenu>
        </div>
    )
}
