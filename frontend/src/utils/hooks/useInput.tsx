export type InputHookProps = {
    handler: (files: File[]) => void
    /** allowed file extensions withot dot */
    extensions?: string[]
    multiple: true
} | {
    handler: (file: File) => void
    /** allowed file extensions withot dot */
    extensions?: string[]
    multiple?: false
}

export interface InputHook {
    click(): void
}

export function useInput(props: InputHookProps): InputHook {
    const onClick = () => {
        const input = document.createElement("input")
        input.type = "file"

        if (props.extensions?.length) {
            input.accept = props.extensions
                .map((v) => "." + v)
                .join(",")
        }

        if (props.multiple) input.multiple = true

        input.onchange = (e) => {
            const target = (e.target as HTMLInputElement)
            const files = Array.from(target.files ?? [])

            if (props.multiple) {
                (props.handler as (files: File[]) => void)(files)
            } else {
                (props.handler as (file: File) => void)(files[0])
            }
        }

        input.click()
    }

    return { click: onClick }
}