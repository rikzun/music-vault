import "./UploadTrackProgress.styles.scss"
import { Divider } from "@components/common/Divider"
import { UploadTrackProgressProps } from "./UploadTrackProgress.types"
import { ReactNode } from "react"
import { CircleProgress } from "@components/common/CircleProgress"
import CheckRounded from "@mui/icons-material/CheckRounded"
import ErrorOutlineRounded from "@mui/icons-material/ErrorOutlineRounded"

export function UploadTrackProgress(props: UploadTrackProgressProps) {
    const imageObjectURL = props.data.meta?.image?.objectURL ?? null

    const title = props.data.meta!.title!
    const artists = props.data.meta!.artists

    let rightElement: ReactNode = null

    if (props.data.errorStatus != null) {
        rightElement = <ErrorOutlineRounded />
    } else {
        if (props.data.progress === 100) {
            rightElement = <CheckRounded />
        } else {
            rightElement = <CircleProgress value={props.data.progress ?? 0} size={28} />
        }
    }

    return (
        <div className="upload-track-progress-component">
            <div className="container">
                <div className="left">
                    <div className="title" title={title} children={title} />

                    <div className="artists">
                        {artists.reduce((acc, artist, index) => {
                            if (index > 0) acc.push(
                                <Divider key={"separator-" + index} />
                            )

                            acc.push(
                                <span
                                    key={"artist-" + artist}
                                    className="artist"
                                    title={artist}
                                    children={artist}
                                />
                            )

                            return acc
                        }, [] as ReactNode[])}
                    </div>
                </div>

                {rightElement != null &&
                    <div className="right">
                        {rightElement}
                    </div>
                }
            </div>

            {imageObjectURL &&
                <img
                    className="background"
                    src={imageObjectURL}
                />
            }
        </div>
    )
}