import { MdHideImage } from "react-icons/md"
import "./UploadTrack.styles.scss"
import { UploadTrackProps } from "./UploadTrack.types"


export function UploadTrack(props: UploadTrackProps) {
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
                        {props.data.image &&
                            <img
                                className="image"
                                src={props.data.image?.objectURL}
                            />
                        }

                        {!props.data.image &&
                            <div className="image image-empty">
                                <MdHideImage size={38} />
                            </div>
                        }
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

function formatBitrate(value: numberN) {
    let number = 0
    
    if (value != null) {
        number = Math.round(value / 1000 * 10) / 10
    }

    return number + " kbit/s"
}