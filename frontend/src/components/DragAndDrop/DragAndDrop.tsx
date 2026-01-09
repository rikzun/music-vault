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
                for (const item of Array.from(e.dataTransfer.items)) {
                    const entry = item.webkitGetAsEntry()

                    if (entry) {
                        const files = await traverseFileTree(entry)
                        allFiles.push(...files)
                    } else if (item.kind === "file") {
                        const file = item.getAsFile()
                        if (file) allFiles.push(file)
                    }
                }

                props.onChange(allFiles)
                hovered.set(false)
            }}
            children={props.children}
        />
    )
}

async function traverseFileTree(entry: FileSystemEntry): Promise<File[]> {
    if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry
        const file: File = await new Promise((resolve) => fileEntry.file(resolve))

        return [file]
    }

    if (!entry.isDirectory) return []

    const directory = entry as FileSystemDirectoryEntry
    const reader = directory.createReader()
    const entries: FileSystemEntry[] = await new Promise((resolve) => reader.readEntries(resolve))

    const allFiles: File[] = []
    for (const entry of entries) {
        const files = await traverseFileTree(entry)
        allFiles.push(...files)
    }

    return allFiles
}