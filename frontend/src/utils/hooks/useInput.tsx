export interface InputHookProps {
    handler: (files: File[]) => void
    /** allowed file extensions withot dot */
    extensions?: string[]
    multiple?: boolean
}

export interface InputHook {
    click(): void
}

export function useInput(props: InputHookProps): InputHook {
    const onClick = () => {
        const input = document.createElement('input')
        input.type = 'file'

        if (props.extensions?.length) {
            input.accept = props.extensions
                .map((v) => '.' + v)
                .join(',')
        }

        if (props.multiple) input.multiple = true

        input.onchange = (e) => {
            const target = (e.target as HTMLInputElement)
            const files = Array.from(target.files ?? [])
            props.handler(files)
        }

        input.click()
    }

    return { click: onClick }
}