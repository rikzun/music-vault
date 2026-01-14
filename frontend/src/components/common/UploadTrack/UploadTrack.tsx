import "./UploadTrack.styles.scss"
import HideImageRounded from "@mui/icons-material/HideImageRounded"
import { UploadTrackProps } from "./UploadTrack.types"

export function UploadTrack(props: UploadTrackProps) {
    return (
        <button className="upload-track-component">
            <div className="column-field">
                <div className="column">
                    <div className="field">
                        <div className="title">title</div>
                        <div className="value">{props.data.meta!.title}</div>
                    </div>
                </div>

                <div className="column">
                    <div className="field field-image">
                        {props.data.meta!.image &&
                            <img
                                className="image"
                                src={props.data.meta!.image?.objectURL}
                            />
                        }

                        {!props.data.meta!.image &&
                            <div className="image image-empty">
                                <HideImageRounded />
                            </div>
                        }
                    </div>
                </div>  
            </div>

            <div className="field">
                <div className="title">artist</div>
                <div className="value">{props.data.meta!.artists[0]}</div>
            </div>

            {props.data.meta!.artists.map((artist, index) => {
                if (index == 0) return null
                
                return (
                    <div className="field" key={artist + index}>
                        <div className="title">artist</div>
                        <div className="value">{artist}</div>
                    </div>
                )
            })}

            {props.data.meta!.album && (
                <div className="field">
                    <div className="title">album</div>
                    <div className="value">{props.data.meta!.album}</div>
                </div>
            )}

            
            <div className="column-field">
                <div className="column">
                    <div className="field">
                        <div className="title">codec{props.data.meta!.lossless ? " (lossless)" : " (lossy)"}</div>
                        <div className="value">{props.data.meta!.codec}</div>
                    </div>
                </div>

                <div className="column">
                    <div className="field field-bitrate">
                        <div className="title">bitrate</div>
                        <div className="value">{formatBitrate(props.data.meta!.bitrate)}</div>
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