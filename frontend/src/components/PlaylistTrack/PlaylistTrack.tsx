import { MdHideImage } from "react-icons/md"
import "./PlaylistTrack.style.scss"
import { Track } from "src/common/types"
import { ReactNode } from "react"

interface PlaylistTrackProps {
    data: Track
    onClick?: () => void
}

export function PlaylistTrack(props: PlaylistTrackProps) {
    return (
        <button className="track-component" onClick={props.onClick}>
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

            <img className="background" src={ENV.APP_URL + props.data.imageURL} />
        </button>
    )
}