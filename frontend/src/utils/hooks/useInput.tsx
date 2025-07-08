export interface InputHook {
    click(): void
}

export function useInput(handler: (files: File[]) => void): InputHook {
    const onClick = () => {
        const input = document.createElement('input')
        input.type = 'file'

        input.onchange = (e) => {
            const target = (e.target as HTMLInputElement)
            const files = Array.from(target.files ?? [])
            handler(files)
        }

        input.click()
    }

    return { click: onClick }
}