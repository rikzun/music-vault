import "./DragAndDrop.style.scss"
import type { DragAndDropProps } from "./DragAndDrop.types"
import { useResizeObserver, useState } from "@utils/hooks"
import { useRef } from "react"

export function DragAndDrop(props: DragAndDropProps) {
    const timeout = useRef<NodeJS.Timeout>(null)
    const hovered = useState(false)
    const planeSize = useState(0)

    let className = "dnd-component"
    if (props.className) className += " " + props.className
    if (props.disabled) className += " dnd-component__disabled"
    else if (hovered.value) className += " dnd-component__hovered"

    // TODO: try to fix
    const ref = useResizeObserver((entries) => {
        const target = entries[0].target
        planeSize.set(target.scrollHeight)
    })

    return (
        <div
            ref={ref}
            style={{ "--plane-size": planeSize.value + "px" }}
            className={className}
            aria-label={props["aria-label"]}
            onDragOver={(e) => {
                if (props.disabled) return
                if (e.dataTransfer.types[0] !== "Files" && e.dataTransfer.types.length > 1) return

                e.preventDefault()
                e.stopPropagation()
                e.dataTransfer.dropEffect = "copy"

                clearTimeout(timeout.current ?? undefined)
                hovered.set(true)
            }}
            onDragLeave={(e) => {
                if (props.disabled) return

                e.preventDefault()

                clearTimeout(timeout.current ?? undefined)
                timeout.current = setTimeout(() => {
                    hovered.set(false)
                }, 10)
            }}
            onDrop={async(e) => {
                if (props.disabled) return

                e.preventDefault()
                clearTimeout(timeout.current ?? undefined)

                const allFiles: File[] = []
                const allEntries: FileSystemEntry[] = []

                for (const item of e.dataTransfer.items) {
                    const entry = item.webkitGetAsEntry()

                    if (entry) {
                        allEntries.push(entry)
                        continue
                    }

                    if (item.kind === "file") {
                        const file = item.getAsFile()
                        if (file) allFiles.push(file)
                    }
                }

                while (true) {
                    const entry = allEntries.pop()
                    if (!entry) break

                    if (entry.isFile) {
                        const fileEntry = entry as FileSystemFileEntry
                        const file: File = await new Promise((resolve) => fileEntry.file(resolve))

                        allFiles.push(file)
                        continue
                    }

                    if (!entry.isDirectory) continue

                    const dirEntry = entry as FileSystemDirectoryEntry
                    const reader = dirEntry.createReader()

                    const entries: FileSystemEntry[] = await new Promise((resolve) => reader.readEntries(resolve))
                    allEntries.push(...entries)
                }

                props.onChange(allFiles)
                hovered.set(false)
            }}
            children={props.children}
        />
    )
}