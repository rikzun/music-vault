import { MdArchive } from "react-icons/md"
import "./Playlist.style.scss"
import { handleEnter } from "@utils/events"

interface PlaylistProps {
    onClick?: () => void
}

export function Playlist(props: PlaylistProps) {
    return (
        <button className="playlist-component" onPointerDown={(e) => e.button == 0 && props.onClick?.()} onKeyDown={handleEnter}>
            <div className="cover cover__icon">
                <MdArchive />
            </div>

            <div className="title">
                Uploaded
            </div>
        </button>
    )
}