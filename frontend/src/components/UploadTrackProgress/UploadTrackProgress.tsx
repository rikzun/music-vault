import "./UploadTrackProgress.styles.scss"
import { UploadTrackProgressProps } from "./UploadTrackProgress.types"
import { MdInfoOutline } from "react-icons/md"

export function UploadTrackProgress(props: UploadTrackProgressProps) {
    const artists = props.data.artists.join(", ")

    let progress = props.data.progress
    let infoColor: string | undefined
    
    switch (props.data.status) {
        case "unknown_error": {
            progress = 0
            infoColor = "#EF5350"
            break
        }
    }

    if (progress === 100) {
        progress = 0
    }

    return (
        <div className="upload-track-progress-component">
            <div className="container">
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
            
            <div
                className="progress"
                style={{width: progress + "%"}}
            />
        </div>
    )
}