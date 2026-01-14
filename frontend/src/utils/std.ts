import { BaseSyntheticEvent } from "react"

export function preventEvent(e: BaseSyntheticEvent) {
    e.preventDefault()
}

export function concatArrayBuffers(...buffers: ArrayBufferLike[]): ArrayBuffer {
    const totalLength = buffers.reduce((acc, buf) => acc + buf.byteLength, 0)
    const temp = new Uint8Array(totalLength)
    let offset = 0
  
    for (const buf of buffers) {
        temp.set(new Uint8Array(buf), offset)
        offset += buf.byteLength
    }
  
    return temp.buffer
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}

export const mobileRegex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Kindle|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune|AvantGo|Bolt|Boost|Cricket|Docomo|Fone|Hiptop|Palm|Phone|Pie|Tablet|UP\.Browser|UP\.Link|SM-[A-Z]|GT-[A-Z]|SCH-[A-Z]|SAMSUNG|Samsung|Pixel/i

export function isMobile(): boolean {
    if ("userAgentData" in navigator) {
        const userAgentData = navigator.userAgentData as any

        if ("mobile" in userAgentData) {
            return userAgentData.mobile
        }
    }

    return mobileRegex.test(navigator.userAgent)
}

export function trimAndNullIfEmpty(data: string | null | undefined): string | null {
    if (!data) return null
    const value = data.trim()

    if (!value) return null
    return value
}