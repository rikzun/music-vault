import { MouseEvent } from "react"
import type { IconType } from "react-icons"

interface ButtonPropsBase {
    "aria-label"?: string
    className?: string
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

export interface ButtonPropsMenu extends ButtonPropsBase {
    icon: IconType
    isPressed: boolean
}

export interface ButtonPropsSmall extends ButtonPropsBase {
    value: string
    fullWidth?: boolean
}

export interface ButtonPropsText extends ButtonPropsBase {
    value: string
}