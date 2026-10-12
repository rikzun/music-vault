import { Ref } from "react"
import { ReactEvent } from "@utils/react"
import { MdIcon } from "../../../types/global"

interface ButtonBaseProps {
    "aria-label"?: string
    className?: string
    onClick?: ReactEvent.Mouse.Handler<HTMLButtonElement> | null
    ref?: Ref<HTMLButtonElement> | undefined
    color?: string
}

export interface ButtonMenuProps extends ButtonBaseProps {
    icon: MdIcon
    isPressed: boolean
}

export interface ButtonSmallProps extends ButtonBaseProps {
    value: string
    disabled?: boolean
    fullWidth?: boolean
}

export interface ButtonTinyProps extends ButtonSmallProps {}

export interface ButtonTextProps extends ButtonBaseProps {
    value: string
}

export interface ButtonIconProps extends ButtonBaseProps {
    icon: MdIcon
}