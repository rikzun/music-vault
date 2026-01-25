export interface InputTextProps {
    defaultValue?: string | null
    value?: string | null
    onChange: (content: string) => void
    fullWidth?: boolean | null
}

export interface InputImageProps {
    imageURL?: string | null
    onChange: (file: File) => void
}