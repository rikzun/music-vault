import "./TrackImage.style.scss"
import HideImageRounded from "@mui/icons-material/HideImageRounded"

interface TrackImageProps {
    imageURL?: stringN
}

export function TrackImage(props: TrackImageProps) {
    let className = "track-image-component"
    if (props.imageURL == null) className += " track-image-component__empty"

    const child = props.imageURL
        ? <img src={ENV.APP_URL + props.imageURL} draggable="false" />
        : <HideImageRounded />
    
    return (
        <div
            className={className}
            children={child}
        />
    )
}