import "./ImageLoader.style.scss"
import { useState } from "@utils/hooks"

interface ImageLoaderProps {
    imageURL: string
}

export function ImageLoader(props: ImageLoaderProps) {
    const hover = useState(false)

    return (
        <div
            className="image-loader-component"
            onPointerEnter={() => (console.log(true), hover.set(true))}
            onPointerLeave={() => (console.log(false), hover.set(false))}
        />
    )
}