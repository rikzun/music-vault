import { CSSProperties, MouseEvent, Ref } from "react"
import { PopupMenuData, PopupMenuInitiator } from "src/types/popupMenu"
import { MdIcon } from "src/types/types"

interface ButtonBaseProps {
    "aria-label"?: string
    "data-pm"?: PopupMenuData
    "data-pmi"?: PopupMenuInitiator
    className?: string
    onClick?: ((e: MouseEvent<HTMLButtonElement>) => void) | null
    ref?: Ref<HTMLButtonElement> | undefined
    color?: string
}

export interface ButtonMenuProps extends ButtonBaseProps {
    icon: MdIcon
    isPressed: boolean
}

export interface ButtonSmallProps extends ButtonBaseProps {
    value: string
    fullWidth?: boolean
}

export interface ButtonTinyProps extends ButtonSmallProps {}

export interface ButtonTextProps extends ButtonBaseProps {
    value: string
}

export interface ButtonIconProps extends ButtonBaseProps {
    icon: MdIcon
    exPadding?: number
}