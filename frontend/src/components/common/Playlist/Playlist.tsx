import { ReactEvent } from "@utils/react"
import "./Playlist.style.scss"
import ArchiveRounded from "@mui/icons-material/ArchiveRounded"

interface PlaylistProps {
    title: string
    imageURL?: string | null
    onClick: () => void
    onPointerDown?: ReactEvent.Pointer.Handler<HTMLButtonElement> | null
    onContextMenu?: ReactEvent.Mouse.Handler<HTMLButtonElement> | null
}

type PlaylistUploadedProps = Omit<PlaylistProps, "title" | "imageURL" | "onPointerDown" | "onContextMenu">

export const Playlist = Object.assign(
    (props: PlaylistProps) => {
        const style = props.imageURL
            ? { "--background-url": `url(${ENV.APP_URL + props.imageURL})` }
            : undefined

        return (    
            <button
                className="playlist-component"
                style={style}
                onClick={props.onClick}
                onPointerDown={props.onPointerDown || undefined}
                onContextMenu={props.onContextMenu || undefined}
            >
                <div className="cover cover__icon" />
                <div className="title" children={props.title} />
            </button>
        )
    }, {
        Uploaded: (props: PlaylistUploadedProps) => {
            return (    
                <button
                    className="playlist-component"
                    onClick={props.onClick}
                >
                    <div className="cover cover__icon">
                        <ArchiveRounded />
                    </div>

                    <div className="title">
                        Uploaded
                    </div>
                </button>
            )
        }
    }
)