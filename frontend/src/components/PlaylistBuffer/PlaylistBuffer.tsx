import "./PlaylistBuffer.style.scss"
import { PlaylistAtoms } from "@atoms/playlist"
import { BufferAtoms } from "@atoms/buffer"
import { Button } from "@components/Button"
import CloseRounded from "@mui/icons-material/CloseRounded"

export function PlaylistBuffer() {
    const playlists = PlaylistAtoms.usePlaylists()
    const bufferedPlaylist = BufferAtoms.usePlaylistID()

    if (bufferedPlaylist.value == null) return null

    const playlist = playlists.value
        .find((v) => v.id == bufferedPlaylist.value)

    if (playlist == null) return null

    return (
        <div className="playlist-buffer-component">
            <div className="background">
                {playlist.imageURL && <img src={playlist.imageURL} />}
            </div>

            <div className="block">
                <div className="info">
                    {playlist.title}
                </div>

                <Button.Icon
                    icon={CloseRounded} 
                    onClick={() => bufferedPlaylist.set(null)}
                />
            </div>

        </div>
    )
}
