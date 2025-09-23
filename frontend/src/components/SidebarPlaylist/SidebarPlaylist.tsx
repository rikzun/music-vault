import { PlaylistAtoms } from "@atoms/playlist";

export function SidebarPlaylist() {
    const playlist = PlaylistAtoms.usePlaylistID()

    return (
        <div className="section-content section-content__playlists">
            <div className="title">
                Playlists
            </div>

            <button onClick={() => playlist.set(0)}>Загруженные треки</button>
        </div>
    )
}
