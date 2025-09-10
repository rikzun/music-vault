import "./UploadTrack.styles.scss"
import { UploadTrackProps } from "./UploadTrack.types"
import { MdInfoOutline } from "react-icons/md"

export function UploadTrack(props: UploadTrackProps) {
    if (props.data.progress != null) {
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
                className="upload-track-component upload-track-component__uploading"
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

    return (
        <button className="upload-track-component">
            <div className="column-field">
                <div className="column">
                    <div className="field">
                        <div className="title">title</div>
                        <div className="value">{props.data.title}</div>
                    </div>
                </div>

                <div className="column">
                    <div className="field field-image">
                        <img src={props.data.image?.objectURL} />
                    </div>
                </div>
            </div>

            <div className="field">
                <div className="title">artist</div>
                <div className="value">{props.data.artists[0]}</div>
            </div>

            {props.data.artists.map((artist, index) => {
                if (index == 0) return null
                
                return (
                    <div className="field" key={artist + index}>
                        <div className="title">artist</div>
                        <div className="value">{artist}</div>
                    </div>
                )
            })}

            {props.data.album && (
                <div className="field">
                    <div className="title">album</div>
                    <div className="value">{props.data.album}</div>
                </div>
            )}

            
            <div className="column-field">
                <div className="column">
                    <div className="field">
                        <div className="title">codec{props.data.lossless ? " (lossless)" : " (lossy)"}</div>
                        <div className="value">{props.data.codec}</div>
                    </div>
                </div>

                <div className="column">
                    <div className="field field-bitrate">
                        <div className="title">bitrate</div>
                        <div className="value">{formatBitrate(props.data.bitrate)}</div>
                    </div>
                </div>
            </div>
        </button>
    )
}

function formatBitrate(value: number | null) {
    let number = 0
    
    if (value != null) {
        number = Math.round(value / 1000 * 10) / 10
    }

    return number + " kbit/s"
}