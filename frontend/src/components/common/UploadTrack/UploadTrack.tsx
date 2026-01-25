import "./UploadTrack.styles.scss"
import HideImageRounded from "@mui/icons-material/HideImageRounded"
import { UploadTrackProps } from "./UploadTrack.types"
import { TrackEditFields, UploadAtoms } from "@atoms/upload"
import { useTrueClick } from "@utils/hooks/useTrueClick"
import { Input } from "@components/common/Input"
import { PopupMenuData } from "src/types/popupMenu"
import { EventBus } from "@utils/hooks"

export function UploadTrack(props: UploadTrackProps) {
    const currentEditKey = UploadAtoms.useCurrentEditKey()
    const currentTrackData = UploadAtoms.useCurrentTrackData()
    const isEditing = currentEditKey.value === props.data.key

    const turnEditMode = () => {
        currentEditKey.set(props.data.key)

        currentTrackData.set({
            title: props.data.meta?.title ?? "",
            artists: props.data.meta?.artists ?? [],
            album: props.data.meta?.album ?? ""
        })
    }

    const trueClick = useTrueClick(() => {
        if (isEditing) return
        turnEditMode()
    })

    EventBus.useListener("uploadTrackEdit", (data: { key: number }) => {
        if (data.key !== props.data.key) return
        turnEditMode()
    })

    let className = "upload-track-component"
    if (isEditing) className += " " + className + "__editing"

    const popupMenu: PopupMenuData = {
        type: "uploadTrack",
        data: { key: props.data.key }
    }

    const dataPM = isEditing ? undefined : JSON.stringify(popupMenu)

    return (
        <div className={className} tabIndex={0} {...(isEditing ? {} : trueClick)} data-pm={dataPM}>
            <div className="column-field">
                <div className="column">
                    <div className="field">
                        <div className="title">title</div>
                        <div className="value">
                            {isEditing &&
                                <Input.Text
                                    value={currentTrackData.value!.title}
                                    onChange={(value) => {
                                        currentTrackData.set((prev) => {
                                            prev!.title = value
                                            return {...prev} as TrackEditFields
                                        })
                                    }}
                                    fullWidth
                                />
                            }

                            {!isEditing && props.data.meta!.title}
                        </div>
                    </div>

                    <div className="field">
                        <div className="title">artist</div>
                        <div className="value">
                            {isEditing &&
                                <Input.Text
                                    value={currentTrackData.value!.artists[0]}
                                    onChange={(value) => {
                                        currentTrackData.set((prev) => {
                                            prev!.artists[0] = value
                                            return {...prev} as TrackEditFields
                                        })
                                    }}
                                    fullWidth
                                />
                            }

                            {!isEditing && props.data.meta!.artists[0]}
                        </div>
                    </div>
                </div>

                <div className="column column-image">
                    <div className="field field-image">
                        {props.data.meta!.image &&
                            <img
                                className="image"
                                src={props.data.meta!.image?.objectURL}
                                draggable={false}
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
                    <div className="value">
                        {isEditing &&
                            <Input.Text
                                value={currentTrackData.value!.album}
                                onChange={(value) => {
                                    currentTrackData.set((prev) => {
                                        prev!.album = value
                                        return {...prev} as TrackEditFields
                                    })
                                }}
                                fullWidth
                            />
                        }

                        {!isEditing && props.data.meta!.album}
                    </div>
                </div>
            )}

            
            <div className="column-field">
                <div className="column">
                    <div className="field">
                        <div className="title">codec{props.data.meta!.lossless ? " (lossless)" : " (lossy)"}</div>
                        <div className="value">{props.data.meta!.codec}</div>
                    </div>
                </div>

                <div className="column column-bitrate">
                    <div className="field field-bitrate">
                        <div className="title">bitrate</div>
                        <div className="value">{formatBitrate(props.data.meta!.bitrate)}</div>
                    </div>
                </div>
            </div>

            <div className="field field-filename">
                {props.data.file.name}
            </div>
        </div>
    )
}

function formatBitrate(value: number | null) {
    let number = 0
    
    if (value != null) {
        number = Math.round(value / 1000 * 10) / 10
    }

    return number + " kbit/s"
}