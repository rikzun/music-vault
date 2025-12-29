import "./PlaylistInfo.styles.scss"
import { PlaylistAtoms } from "@atoms/playlist"
import { Button } from "@components/Button"
import { PlaylistShortData } from "@components/SidebarPlaylist/SidebarPlaylist.types"
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded"

export function PlaylistInfo() {
    const playlists = PlaylistAtoms.usePlaylists()
    const currentPlaylistID = PlaylistAtoms.useCurrentPlaylistID()
    if (currentPlaylistID.value == null) return null

    const currentPlaylist = currentPlaylistID.value == 0
        ? { title: "Uploaded", trackIdList: [] as number[] } as PlaylistShortData
        : playlists.value.find((v) => v.id === currentPlaylistID.value)

    if (!currentPlaylist) return null
    
    return (
        <div className="playlist-info-component">
            <div className="info">
                <span className="title">
                    {currentPlaylist.title}
                </span>

                <span className="count">
                    {currentPlaylist.trackIdList.length} items
                </span>

                <span className="divider">•</span>

                <span className="duration">
                    %s min
                </span>
            </div>

            <Button.Icon
                icon={MoreHorizRounded}
            />
        </div>
    )
}