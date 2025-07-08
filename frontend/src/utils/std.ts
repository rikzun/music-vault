import { BaseSyntheticEvent } from "react"

export function preventEvent(e: BaseSyntheticEvent) {
    e.preventDefault()
}