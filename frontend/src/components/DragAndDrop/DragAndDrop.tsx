import "./DragAndDrop.style.scss"
import type { DragAndDropProps } from "./DragAndDrop.types"
import { useState } from "@utils/hooks"
import { useRef } from "react"

export function DragAndDrop(props: DragAndDropProps) {
    const timeout = useRef<NodeJS.Timeout>(null)
    const hovered = useState(false)

    let className = "dnd-component"
    if (props.className) className += " " + props.className
    if (hovered.value) className += " dnd-component__hovered"

    return (
        <div
            className={className}
            aria-label={props["aria-label"]}
            onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                e.dataTransfer.dropEffect = "copy"

                clearTimeout(timeout.current ?? undefined)
                hovered.set(true)
            }}
            onDragLeave={(e) => {
                e.preventDefault()

                clearTimeout(timeout.current ?? undefined)
                timeout.current = setTimeout(() => {
                    hovered.set(false)
                }, 10)
            }}
            onDrop={(e) => {
                e.preventDefault()
                clearTimeout(timeout.current ?? undefined)

                props.onChange(Array.from(e.dataTransfer.files))
                hovered.set(false)
            }}
            children={props.children}
        />
    )
}