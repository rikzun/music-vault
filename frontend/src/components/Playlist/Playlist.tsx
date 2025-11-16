import "./Playlist.style.scss"
import ArchiveRounded from "@mui/icons-material/ArchiveRounded"
import { handleEnter } from "@utils/events"
import { PopupMenuData } from "src/common/popupMenu"

interface PlaylistProps {
    "data-pm"?: PopupMenuData
    onClick: () => void
    title: string
}

export function Playlist(props: PlaylistProps) {
    return (
        <button
            className="playlist-component"
            data-pm={JSON.stringify(props["data-pm"])}
            onPointerDown={(e) => e.button == 0 && props.onClick()}
            onKeyDown={handleEnter}
        >
            <div className="cover cover__icon">
                <ArchiveRounded />
            </div>

            <div className="title">
                {props.title}
            </div>
        </button>
    )
}