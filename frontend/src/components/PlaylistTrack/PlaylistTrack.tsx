import "./PlaylistTrack.style.scss"
import { Track } from "src/types/types"
import { ReactNode } from "react"
import { handleEnter } from "@utils/events"
import { Button } from "@components/Button"
import AddRounded from "@mui/icons-material/AddRounded"
import MoreVertRounded from "@mui/icons-material/MoreVertRounded"
import { useTrueClick } from "@utils/hooks/useTrueClick"

interface PlaylistTrackProps {
    data: Track
    onClick?: () => void
}

export function PlaylistTrack(props: PlaylistTrackProps) {
    const trueClick = useTrueClick(props.onClick)

    return (
        <div tabIndex={0} className="track-component" {...trueClick}>
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
                <Button.Icon
                    icon={AddRounded}
                    onClick={() => console.log("aaa")}
                />

                <Button.Icon
                    icon={MoreVertRounded}
                    onClick={() => console.log("aaa")}
                />
            </div>

            <img className="background" src={ENV.APP_URL + props.data.imageURL} />
        </div>
    )
}