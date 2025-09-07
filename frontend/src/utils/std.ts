import { BaseSyntheticEvent } from "react"

export function preventEvent(e: BaseSyntheticEvent) {
    e.preventDefault()
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}