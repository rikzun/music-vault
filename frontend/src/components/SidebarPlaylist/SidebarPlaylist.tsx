import { PlaylistAtoms } from "@atoms/playlist";

export function SidebarPlaylist() {
    const playlist = PlaylistAtoms.usePlaylistID()

    return (
        <div>
            <button onClick={() => playlist.set(0)}>Загруженные треки</button>
        </div>
    )
}
