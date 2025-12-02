export interface InputExpandedProps {
    defaultValue?: string | null
    value?: string | null
    onChange: (content: string) => void
}

export interface InputImageProps {
    imageURL?: string | null
    onChange: (file: File) => void
}