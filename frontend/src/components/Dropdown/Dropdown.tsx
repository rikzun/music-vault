import { Plane } from "@components/ContextMenu"
import "./Dropdown.styles.scss"
import { StateHook, useState } from "@utils/hooks"
import { ReactNode, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Vector2 } from "src/common/types"

type VerticalAnchor = "top" | "center" | "bottom"
type HorizontalAnchor = "left" | "center" | "right"
interface AnchorOrigin {
    horizontal?: HorizontalAnchor
    vertical?: VerticalAnchor
}
interface TransformOrigin {
    horizontal?: HorizontalAnchor
    vertical?: VerticalAnchor
}

export interface DropdownProps {
    open: StateHook<boolean>
    anchorEl?: HTMLElementN
    anchorOrigin?: AnchorOrigin
    transformOrigin?: TransformOrigin
}

const PADDING = 16

const CALCULATE_COORDS_X = {
    left: (anchor: number, dropdownRect: DOMRect) => (anchor),
    center: (anchor: number, dropdownRect: DOMRect) => (anchor - (dropdownRect.width / 2)),
    right: (anchor: number, dropdownRect: DOMRect) => (anchor - dropdownRect.width),
}

const CALCULATE_COORDS_Y = {
    top: (anchor: number, dropdownRect: DOMRect) => (anchor),
    center: (anchor: number, dropdownRect: DOMRect) => ((anchor - (dropdownRect.height / 2))),
    bottom: (anchor: number, dropdownRect: DOMRect) => (anchor - dropdownRect.height)
}

const CALCULATE_ANCHOR_X = {
    left: (rect: DOMRect) => (rect.left),
    center: (rect: DOMRect) => ((rect.left + (rect.width / 2))),
    right: (rect: DOMRect) => (rect.left + rect.width),
}

const CALCULATE_ANCHOR_Y = {
    top: (rect: DOMRect) => (rect.top),
    center: (rect: DOMRect) => (rect.top + (rect.height / 2)),
    bottom: (rect: DOMRect) => (rect.top + rect.height)
}

export function Dropdown(props: DropdownProps) {
    const pos = useState<Vector2 | null>(null)
    const ref = useRef<HTMLDivElementN>(null)

    useEffect(() => {
        if (!props.anchorEl) return
        if (!ref) return
        if (!props.open.value) {
            props.anchorEl.style = ""
            pos.set(null)
            return
        }

        const horizontalAnchor = props.anchorOrigin?.horizontal ?? "left"
        const verticalAnchor = props.anchorOrigin?.vertical ?? "bottom"

        const horizontalOrigin = props.transformOrigin?.horizontal ?? "left"
        const verticalOrigin = props.transformOrigin?.vertical ?? "top"

        const rect = props.anchorEl.getBoundingClientRect()
        const dropdownRect = ref.current!.getBoundingClientRect()

        const calculatedAnchor = {
            x: CALCULATE_ANCHOR_X[horizontalAnchor](rect),
            y: CALCULATE_ANCHOR_Y[verticalAnchor](rect),
        }

        let finalX = CALCULATE_COORDS_X[horizontalOrigin](calculatedAnchor.x, dropdownRect)
        let finalY = CALCULATE_COORDS_Y[verticalOrigin](calculatedAnchor.y, dropdownRect)

        const left = finalX - PADDING
        const right = finalX + dropdownRect.width + PADDING
        const top = finalY - PADDING
        const bottom = finalY + dropdownRect.height + PADDING

        if (right > document.body.clientWidth) {
            finalX = document.body.clientWidth - dropdownRect.width - PADDING
        }

        if (left < 0) {
            finalX = PADDING
        }

        if (top < 0) {
            finalY = PADDING
        }

        if (bottom > document.body.clientHeight) {
            finalY = document.body.clientHeight - dropdownRect.height - PADDING
        }

        props.anchorEl.style = "z-index: 9998"
        pos.set({x: finalX, y: finalY})
    }, [props.anchorEl, props.open])

    const rt: ReactNode = (
        <div
            className="dropdown-component"
            ref={ref}
            style={{
                visibility: pos.value ? "visible" : "hidden",
                left: pos.value ? pos.value.x + "px" : undefined,
                top: pos.value ? pos.value.y + "px" : undefined
            }}
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault() }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
        >
            <div>option 1</div>
            <div>option 2</div>
            <div>option 3</div>
            <div>option 4</div>
        </div>
    )

    const plane = (
        <Plane
            onPointerDown={() => { props.open.set(false); pos.set(null) }}
            onTouchStart={() => { props.open.set(false); pos.set(null) }}
        />
    )

    return <>
        {createPortal(rt, document.getElementById("root")!)}
        {props.open.value && createPortal(plane, document.getElementById("root")!)}
    </>
}
