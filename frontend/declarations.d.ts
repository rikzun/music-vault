declare global {
    const ROOT: HTMLDivElement

    interface Window {
        readonly ROOT: HTMLDivElement
    }

    declare const ENV: {
        readonly APP_URL: string
    }
}

export {}