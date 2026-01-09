import "./PlaylistInfo.styles.scss"
import { PlaylistAtoms } from "@atoms/playlist"
import { Button } from "@components/Button"
import { Divider } from "@components/Divider"
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded"

export function PlaylistInfo() {
    const playlists = PlaylistAtoms.usePlaylists()
    const currentPlaylistID = PlaylistAtoms.useCurrentPlaylistID()
    if (currentPlaylistID.value == null) return null

    const playlystIsUploaded = currentPlaylistID.value === 0
    const currentPlaylist = playlists.value.find((v) => v.id === currentPlaylistID.value)
    if (!currentPlaylist) return null
    
    return (
        <div className="playlist-info-component">
            <div className="info">
                <span className="title">
                    {playlystIsUploaded
                        ? "Uploaded"
                        : currentPlaylist.title}
                </span>

                <span className="count">
                    {currentPlaylist.trackIdList.length} items
                </span>

                <Divider />

                <span className="duration">
                    {formatDuration(currentPlaylist.duration)}
                </span>
            </div>

            {!playlystIsUploaded &&
                <Button.Icon
                    icon={MoreHorizRounded}
                    data-pmi={{
                        type: "addPlaylistToBuffer",
                        anchorH: "right",
                        data: { id: currentPlaylistID.value }
                    }}
                />
            }
        </div>
    )
}

function formatDuration(duration: number): string {
    const msDuration = Math.round(duration * 1000)

    const hours = Math.floor(msDuration / 3600000)
    const minutes = Math.floor((msDuration % 3600000) / 60000)
    const seconds = Math.floor((msDuration % 60000) / 1000)

    const strMinutes = String(minutes).padStart(2, "0")
    const strSeconds = String(seconds).padStart(2, "0")

    return `${(hours > 0 ? hours + ":" : "")}${strMinutes}:${strSeconds}`
}
