import { PropsWithChildren } from "react"

export interface DragAndDropProps extends PropsWithChildren {
    "aria-label": string
    className?: string
    onChange: (files: File[]) => void
    disabled?: boolean | null
}