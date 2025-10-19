import { MouseEvent, Ref } from "react"
import type { IconType } from "react-icons"

interface ButtonBaseProps {
    "aria-label"?: string
    className?: string
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
    ref?: Ref<HTMLButtonElement> | undefined
}

export interface ButtonMenuProps extends ButtonBaseProps {
    icon: IconType
    isPressed: boolean
}

export interface ButtonSmallProps extends ButtonBaseProps {
    value: string
    fullWidth?: boolean
}

export interface ButtonTextProps extends ButtonBaseProps {
    value: string
}

export interface ButtonIconProps extends ButtonBaseProps {
    icon: IconType
}