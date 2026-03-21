import { CSSProperties, HTMLInputAutoCompleteAttribute } from "react"

export interface InputTextProps {
    defaultValue?: string | null
    value?: string | null
    onChange: (content: string) => void
    fullWidth?: boolean | null
    style?: CSSProperties | null
}

export interface InputImageProps {
    imageURL?: string | null
    disabled?: boolean | null
    onChange: (file: File) => void
}

export interface InputFormFieldProps {
    label?: string | null
    subLabel?: string | null
    fullWidth?: boolean | null

    defaultValue?: string | null
    value?: string | null
    placeholder?: string | null

    onChange?: (content: string) => void
    onSubLabelClick?: () => void

    email?: boolean | null
    password?: boolean | null
    autoComplete?: HTMLInputAutoCompleteAttribute | null
}