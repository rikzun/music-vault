import "./UploadTrackProgress.styles.scss"
import { UploadTrackProgressProps } from "./UploadTrackProgress.types"
import { MdInfoOutline } from "react-icons/md"

export function UploadTrackProgress(props: UploadTrackProgressProps) {
    const artists = props.data.artists.join(", ")

    let progressVar = props.data.progress + "%"
    let infoColor: string | undefined
    
    switch (props.data.status) {
        case "unknown_error": {
            progressVar = "0%"
            infoColor = "#EF5350"
            break
        }
    }

    return (
        <div
            className="upload-track-progress-component"
            style={{"--progress": progressVar}}
        >
            <div className="track-info">
                <div
                    className="artists"
                    title={artists}
                    children={artists}
                />

                <div
                    className="title"
                    title={props.data.title!}
                    children={props.data.title}
                />
            </div>

            {props.data.status != null &&
                <MdInfoOutline
                    className="info"
                    color={infoColor}
                    size={22}
                    title={props.data.status}
                />
            }
        </div>
    )
}