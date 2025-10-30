import { MouseEvent, Ref } from "react"
import { PopupMenuData, PopupMenuInitiator } from "src/common/popupMenu"
import { MdIcon } from "src/common/types"

interface ButtonBaseProps {
    "aria-label"?: string
    "data-pm"?: PopupMenuData
    "data-pmi"?: PopupMenuInitiator
    className?: string
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
    ref?: Ref<HTMLButtonElement> | undefined
}

export interface ButtonMenuProps extends ButtonBaseProps {
    icon: MdIcon
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
    icon: MdIcon
}