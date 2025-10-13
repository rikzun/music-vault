export interface PlaneProps {
    onPointerDown: () => void
    onTouchStart: () => void
}

export function Plane(props: PlaneProps) {
    return (
        <div
            className="contextmenu-plane-component"
            onPointerDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                props.onPointerDown()
            }}
            onTouchStart={(e) => {
                e.stopPropagation()
                props.onTouchStart()
            }}
        />
    )
}