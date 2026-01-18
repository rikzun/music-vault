import "./SidebarPlaylist.style.scss"
import axios from "axios"
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded"
import { Button } from "@components/common/Button"
import { PlaylistAtoms } from "@atoms/playlist"
import { Playlist } from "@components/common/Playlist"
import { Scrollbar } from "@components/common/Scrollbar"
import { EventBus, useState } from "@utils/hooks"
import { useEffect } from "react"
import { GetListPlaylistResponse } from "./SidebarPlaylist.types"
import { FadeMenu, FadeMenuContainer } from "@components/common/FadeMenu"
import { PlaylistCreation } from "@components/common/PlaylistCreation"

type Menu = "playlistList" | "playlistCreation"

export function SidebarPlaylist() {
    const menu = useState<Menu>("playlistList")
    const currentPlaylist = PlaylistAtoms.useCurrentPlaylistID()
    const playlists = PlaylistAtoms.usePlaylists()

    EventBus.useListener("playlistCreation", () => menu.set("playlistCreation"))
    EventBus.useListener("playlistCreationCancel", () => menu.set("playlistList"))

    useEffect(() => {
        axios.get<GetListPlaylistResponse>("playlist/get-list").then((res) => {
            // res.data.data.forEach((v) => {
            //     if (!v.imageURL) return

            //     axios.create()
            //         .get<ArrayBuffer>(ENV.APP_URL + v.imageURL, {
            //             headers: { "Content-Type": "application/octet-stream" },
            //             responseType: "arraybuffer"
            //         })
            //         .then((res) => {
            //             FS.createFile(v.id + ".png", res.data)
            //         })
            // })

            playlists.set(res.data.data)
        })
    }, [menu.value])

    return (
        <div className="section-content section-content__playlists">
            <div className="top">
                <span>Playlists</span>

                <Button.Icon
                    icon={MoreHorizRounded}
                    data-pmi={{type: "playlists"}}
                />
            </div>

            <FadeMenuContainer active={menu.value}>
                <FadeMenu type="playlistList">
                    <Scrollbar>
                        <div className="content">
                            <Playlist.Uploaded onClick={() => currentPlaylist.set(0)} />
                            
                            {playlists.value.map((p) => {
                                if (p.id == 0) return null

                                return (
                                    <Playlist
                                        key={p.id}
                                        title={p.title}
                                        imageURL={p.imageURL}
                                        onClick={() => currentPlaylist.set(p.id)}
                                        data-pm={{ type: "addPlaylistToBuffer", data: { id: p.id } }}
                                    />
                                )
                            })}
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
