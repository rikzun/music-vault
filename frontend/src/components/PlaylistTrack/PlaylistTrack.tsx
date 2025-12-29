import "./PlaylistTrack.style.scss"
import { Track } from "src/types/types"
import { ReactNode } from "react"
import { Button } from "@components/Button"
import AddRounded from "@mui/icons-material/AddRounded"
import RemoveRounded from "@mui/icons-material/RemoveRounded"
import MoreVertRounded from "@mui/icons-material/MoreVertRounded"
import { useTrueClick } from "@utils/hooks/useTrueClick"
import { BufferAtoms } from "@atoms/buffer"
import { PlaylistAtoms } from "@atoms/playlist"
import { bufferAddTrack, bufferRemoveTrack } from "src/App"

interface PlaylistTrackProps {
    data: Track
    onClick?: () => void
}

export function PlaylistTrack(props: PlaylistTrackProps) {
    const playlists = PlaylistAtoms.usePlaylists()
    const bufferPlaylistID = BufferAtoms.usePlaylistID()

    const trueClick = useTrueClick(props.onClick)

    const bufferPlaylistIndex = bufferPlaylistID.value
        ? playlists.value.findIndex((v) => v.id == bufferPlaylistID.value)
        : -1

    const bufferPlaylistTrackIdList = bufferPlaylistID.value
        ? playlists.value[bufferPlaylistIndex].trackIdList
        : []

    const showBufferIcon = bufferPlaylistID.value != null
    const bufferAddAction = !bufferPlaylistTrackIdList.includes(props.data.id)

    return (
        <div className="track-component" tabIndex={0} {...trueClick}>
            {props.data.imageURL
                ? <img className="cover" src={ENV.APP_URL + props.data.imageURL} />
                : <div className="cover cover__empty" />
            }

            <div className="info">
                <div className="title">
                    {props.data.title}
                </div>
                
                <div className="artists">
                    {props.data.artists.reduce((acc, v, index) => {
                        if (index > 0) {
                            acc.push(
                                <span
                                    key={"separator-" + index}
                                    className="separator"
                                    children="•"
                                />
                            )
                        }

                        acc.push(
                            <span
                                key={"artist-" + v.name}
                                className="artist"
                                children={v.name}
                            />
                        )

                        return acc
                    }, [] as ReactNode[])}
                </div>
            </div>

            <div className="controls">
                {showBufferIcon &&
                    <Button.Icon
                        icon={bufferAddAction ? AddRounded : RemoveRounded}
                        onClick={(e) => {
                            e.stopPropagation()

                            playlists.set((v) => {
                                const trackIdList = v[bufferPlaylistIndex].trackIdList

                                if (bufferAddAction) {
                                    trackIdList.push(props.data.id)

                                    bufferAddTrack.add(props.data.id)
                                    bufferRemoveTrack.remove(props.data.id)
                                } else {
                                    const index = trackIdList
                                        .findIndex((v) => v === props.data.id)

                                    if (index != -1) {
                                        trackIdList.splice(index, 1)

                                        bufferRemoveTrack.add(props.data.id)
                                        bufferAddTrack.remove(props.data.id)
                                    }
                                }

                                return [...v]
                            })
                        }}
                    />
                }

                <Button.Icon
                    icon={MoreVertRounded}
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                />
            </div>

            <img
                className="background"
                src={ENV.APP_URL + props.data.imageURL}
            />
        </div>
    )
}