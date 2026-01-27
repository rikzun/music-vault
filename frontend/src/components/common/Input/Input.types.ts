import { CSSProperties } from "react"

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