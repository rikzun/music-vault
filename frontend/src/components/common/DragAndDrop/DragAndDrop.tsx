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
            onDrop={async(e) => {
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