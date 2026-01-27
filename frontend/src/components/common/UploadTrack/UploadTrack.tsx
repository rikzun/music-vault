import "./UploadTrack.styles.scss"
import { UploadTrackProps } from "./UploadTrack.types"
import { UploadAtoms } from "@atoms/upload"
import { useTrueClick } from "@utils/hooks/useTrueClick"
import { Input } from "@components/common/Input"
import { PopupMenuData } from "src/types/popupMenu"
import { EventBus } from "@utils/hooks"
import { trackWorker } from "@components/sidebar/SidebarUpload"
import { Button } from "@components/common/Button"
import { trimAndNullIfEmpty } from "@utils/std"
import AddRounded from "@mui/icons-material/AddRounded"
import RemoveRounded from "@mui/icons-material/RemoveRounded"

export function UploadTrack(props: UploadTrackProps) {
    const tracks = UploadAtoms.useTracks()
    const currentEditKey = UploadAtoms.useCurrentEditKey()
    const currentTrackData = UploadAtoms.useCurrentTrackData()
    const isEditing = currentEditKey.value === props.data.key

    const turnEditMode = () => {
        currentEditKey.set(props.data.key)

        currentTrackData.set({
            image: props.data.meta?.image || null,
            title: props.data.meta?.title || null,
            artists: [...(props.data.meta?.artists ?? [])],
            album: props.data.meta?.album || null
        })
    }

    const onSave = () => {
        tracks.set((state) => {
            const index = state.findIndex((v) => v.key === props.data.key)
            if (index === -1) return state

            const artists = currentTrackData.value!.artists
                .map(trimAndNullIfEmpty)
                .filter(Boolean) as string[]

            const trackMeta = state[index].meta!
            trackMeta.image = currentTrackData.value!.image
            trackMeta.title = trimAndNullIfEmpty(currentTrackData.value!.title)
            trackMeta.artists = artists
            trackMeta.album = trimAndNullIfEmpty(currentTrackData.value!.album)

            return [...state]
        })

        currentEditKey.set(null)
        currentTrackData.set(null)
    }

    const onReset = () => {
        currentEditKey.set(null)

        currentTrackData.set((state) => {
            const objectURL = state?.image?.objectURL
            if (objectURL) URL.revokeObjectURL(objectURL)
            
            return null
        })
    }

    const trueClick = useTrueClick(() => {
        if (isEditing) return
        turnEditMode()
    })

    const addArtist = () => {
        currentTrackData.set((state) => {
            state!.artists = [...state!.artists, ""]

            return {...state!}
        })
    }

    const removeArtist = (index: number) => {
        currentTrackData.set((state) => {
            state!.artists.splice(index, 1)
            state!.artists = [...state!.artists]

            return {...state!}
        })
    }

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
        <div className={className} tabIndex={isEditing ? undefined : 0} {...(isEditing ? {} : trueClick)} data-pm={dataPM}>
            <div className="column-field">
                <div className="column">
                    <div className="field">
                        <div className="title">title</div>
                        <div className="value">
                            {isEditing &&
                                <Input.Text
                                    value={currentTrackData.value!.title}
                                    onChange={(value) => {
                                        currentTrackData.set((state) => {
                                            state!.title = value
                                            return {...state!}
                                        })
                                    }}
                                    fullWidth
                                />
                            }

                            {!isEditing && props.data.meta!.title}

                            {(!isEditing && !props.data.meta!.title) && (
                                <span className="unknown-data">unknown</span>
                            )}
                        </div>
                    </div>

                    <div className="field">
                        <div className="title">artist</div>
                        <div className="value">
                            {isEditing &&
                                <Input.Text
                                    value={currentTrackData.value!.artists[0]}
                                    onChange={(value) => {
                                        currentTrackData.set((state) => {
                                            state!.artists[0] = value
                                            return {...state!}
                                        })
                                    }}
                                    fullWidth
                                    style={{paddingRight: "22px"}}
                                />
                            }

                            {isEditing && (
                                <Button.Icon
                                    icon={AddRounded}
                                    className="add-icon"
                                    data-action="add"
                                    onClick={addArtist}
                                />
                            )}

                            {!isEditing && props.data.meta!.artists[0]}

                            {(!isEditing && !props.data.meta!.artists[0]) && (
                                <span className="unknown-data">unknown</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="column column-image">
                    <div className="field field-image">
                        <Input.Image
                            imageURL={isEditing ? currentTrackData.value?.image?.objectURL : props.data.meta?.image?.objectURL}
                            disabled={!isEditing}
                            onChange={(file) => {
                                trackWorker.rpc.resizeImage(file).then((image) => {
                                    currentTrackData.set((state) => {
                                        const objectURL = state!.image?.objectURL

                                        if (objectURL && objectURL !== props.data.meta?.image?.objectURL) {
                                            URL.revokeObjectURL(objectURL)
                                        }

                                        state!.image = image
                                        return {...state!}
                                    })
                                })
                            }}
                        />
                    </div>
                </div>

            </div>

            {!isEditing && props.data.meta!.artists.map((artist, index) => {
                if (index == 0) return null
                
                return (
                    <div className="field" key={artist + index}>
                        <div className="value">{artist}</div>
                    </div>
                )
            })}

            {isEditing && currentTrackData.value!.artists.map((artist, index) => {
                if (index == 0) return null
                
                return (
                    <div className="field" key={index}>
                        <div className="value">
                            <Input.Text
                                value={currentTrackData.value!.artists[index]}
                                onChange={(value) => {
                                    currentTrackData.set((state) => {
                                        state!.artists[index] = value
                                        return {...state!}
                                    })
                                }}
                                fullWidth
                                style={{paddingRight: "22px"}}
                            />

                            {isEditing && (
                                <Button.Icon
                                    icon={RemoveRounded}
                                    className="add-icon"
                                    data-action="add"
                                    onClick={() => removeArtist(index)}
                                />
                            )}
                        </div>
                    </div>
                )
            })}

            {(props.data.meta!.album || isEditing) && (
                <div className="field">
                    <div className="title">album</div>
                    <div className="value">
                        {isEditing &&
                            <Input.Text
                                value={currentTrackData.value!.album}
                                onChange={(value) => {
                                    currentTrackData.set((prev) => {
                                        prev!.album = value
                                        return {...prev!}
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

            {isEditing && (
                <div className="buttons">
                    <Button.Tiny
                        value="save"
                        onClick={onSave}
                        fullWidth
                    />
                    <Button.Tiny
                        value="reset"
                        onClick={onReset}
                        color="var(--error-color)"
                    />
                </div>
            )}
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