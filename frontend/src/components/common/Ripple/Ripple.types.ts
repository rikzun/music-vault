import type { ElementType, PropsWithChildren } from "react"

export interface RippleItem {
    key: number
    size: number
    x: number
    y: number
    leaving: boolean
}

export interface RippleProps extends PropsWithChildren {
    tag?: ElementType
    disabled?: boolean
}