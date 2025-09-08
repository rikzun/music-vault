import "./DragAndDrop.style.scss"
import type { DragAndDropProps } from "./DragAndDrop.types"
import { useRef } from "react"

export function DragAndDrop(props: DragAndDropProps) {
    const timeout = useRef<NodeJS.Timeout>(null)
    const ref = useRef<HTMLDivElement>(null)

    let className = "dnd-component"
    if (props.className) className += " " + props.className

    return (
        <div
            className={className}
            aria-label={props["aria-label"]}
            ref={ref}
            onDragOver={(e) => {
                e.preventDefault()
                clearTimeout(timeout.current ?? undefined)

                ref.current!.classList.add("dnd-component__hovered")
                e.dataTransfer.dropEffect = "copy"
            }}
            onDragLeave={(e) => {
                e.preventDefault()
                clearTimeout(timeout.current ?? undefined)

                timeout.current = setTimeout(() => {
                    ref.current!.classList.remove("dnd-component__hovered")
                }, 10)
            }}
            onDrop={(e) => {
                e.preventDefault()
                clearTimeout(timeout.current ?? undefined)

                props.onChange(Array.from(e.dataTransfer.files))
                ref.current!.classList.remove("dnd-component__hovered")
            }}
        >
            {props.children}
        </div>
    )
}