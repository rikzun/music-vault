import "./SidebarPlaylist.style.scss"
import { Button } from "@components/Button"
import { PlaylistAtoms } from "@atoms/playlist"
import { Playlist } from "@components/Playlist"
import { Scrollbar } from "@components/Scrollbar"
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded"
import { EventBus, useState } from "@utils/hooks"
import { FadeMenu, FadeMenuContainer } from "@components/FadeMenu"
import { PlaylistCreation } from "@components/PlaylistCreation"
import { useEffect } from "react"
import axios from "axios"
import { GetListPlaylistResponse, PlaylistShortData } from "./SidebarPlaylist.types"
import { PlayerAtoms } from "@atoms/player"

type Menu = "playlistList" | "playlistCreation"

export function SidebarPlaylist() {
    const menu = useState<Menu>("playlistList")
    const currentPlaylist = PlaylistAtoms.useCurrentPlaylistID()
    const playlists = useState<PlaylistShortData[]>([])
    const trackList = PlayerAtoms.useTracklist()

    EventBus.useListener("playlistCreation", () => {
        menu.set("playlistCreation")
    })

    EventBus.useListener("playlistCreationCancel", () => {
        menu.set("playlistList")
    })

    useEffect(() => {
        axios.get<GetListPlaylistResponse>("playlist/get-list").then((res) => {
            playlists.set(res.data.data)
        })
    }, [])

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

            <FadeMenuContainer active={menu.value}>
                <FadeMenu type="playlistList">
                    <Scrollbar>
                        <div className="content">
                            <Playlist title="Uploaded" onClick={() => currentPlaylist.set(0)} />
                            
                            {playlists.value.map((p) => (
                                <Playlist
                                    title={p.title}
                                    data-pm={{ type: "addPlaylistToBuffer", data: { id: p.id } }}
                                    onClick={() => {
                                        currentPlaylist.set(p.id)
                                        // axios.post(`playlist/${p.id}/add-track`, {
                                        //     data: [...trackList.value.keys()]
                                        // })
                                        // return
                                        // axios.get(`playlist/${p.id}/get-tracks`).then((e) => console.log(e.data))
                                    }}
                                />
                            ))}
                        </div>
                    </Scrollbar>
                </FadeMenu>

                <FadeMenu type="playlistCreation">
                    <Scrollbar>
                        <div className="content">
                            <PlaylistCreation />
                        </div>
                    </Scrollbar>
                </FadeMenu>
            </FadeMenuContainer>
        </div>
    )
}
