import "./Playlist.style.scss"
import ArchiveRounded from "@mui/icons-material/ArchiveRounded"
import { useTrueClick } from "@utils/hooks/useTrueClick"
import { PopupMenuData } from "src/types/popupMenu"

interface PlaylistProps {
    title: string
    imageURL?: string | null
    onClick: () => void
    "data-pm"?: PopupMenuData
}

type PlaylistUploadedProps = Omit<Omit<PlaylistProps, "title">, "imageURL">

export const Playlist = Object.assign(
    (props: PlaylistProps) => {
        const trueClick = useTrueClick(props.onClick)

        const style = props.imageURL
            ? { "--background-url": `url(${ENV.APP_URL + props.imageURL})` }
            : undefined

        return (    
            <button
                className="playlist-component"
                data-pm={JSON.stringify(props["data-pm"])}
                style={style}
                {...trueClick}
            >
                <div className="cover cover__icon" />
                <div className="title" children={props.title} />
            </button>
        )
    }, {
        Uploaded: (props: PlaylistUploadedProps) => {
            const trueClick = useTrueClick(props.onClick)

            return (    
                <button
                    className="playlist-component"
                    data-pm={JSON.stringify(props["data-pm"])}
                    {...trueClick}
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