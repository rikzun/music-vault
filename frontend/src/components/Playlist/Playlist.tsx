import { MdArchive } from "react-icons/md"
import "./Playlist.style.scss"

interface PlaylistProps {
    onClick?: () => void
}

export function Playlist(props: PlaylistProps) {
    return (
        <button className="playlist-component" onClick={props.onClick}>
            <div className="cover cover__icon">
                <MdArchive />
            </div>

            <div className="title">
                Uploaded
            </div>
        </button>
    )
}