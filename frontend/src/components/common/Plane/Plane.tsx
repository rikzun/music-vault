import { ReactEvent } from "@utils/react"
import "./Plane.style.scss"

export interface PlaneProps {
    onPointerDown: ReactEvent.Mouse.Handler<HTMLDivElement>
}

export function Plane(props: PlaneProps) {
    return (
        <div
            className="plane-component"
            onPointerDown={props.onPointerDown}
        />
    )
}