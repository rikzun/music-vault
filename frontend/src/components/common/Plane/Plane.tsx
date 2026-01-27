import { useTrueClick } from "@utils/hooks/useTrueClick"
import "./Plane.style.scss"

export interface PlaneProps {
    onClick: () => void
}

export function Plane(props: PlaneProps) {
    const trueClick = useTrueClick(props.onClick, false)

    return (
        <div
            className="plane-component"
            {...trueClick}
        />
    )
}