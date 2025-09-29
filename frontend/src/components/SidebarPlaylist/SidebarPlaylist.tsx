import "./SidebarPlaylist.style.scss"
import { PlaylistAtoms } from "@atoms/playlist"
import { Playlist } from "@components/Playlist"
import { Scrollbar } from "@components/Scrollbar"

export function SidebarPlaylist() {
    const playlist = PlaylistAtoms.usePlaylistID()

    return (
        <div className="section-content section-content__playlists">
            <div className="title">
                Playlists
            </div>

            <Scrollbar>
                <div className="content">
                    <Playlist onClick={() => playlist.set(0)} />
                </div>
            </Scrollbar>
        </div>
    )
}
