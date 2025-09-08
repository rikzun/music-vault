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