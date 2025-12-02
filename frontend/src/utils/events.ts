import { ReactEvent } from "@utils/react"

export function handleEnter<T extends Element>(e: ReactEvent.Keyboard<T>) {
    if (e.key !== "Enter") return
    e.preventDefault()

    const target = e.target as HTMLElement
    const rect = target.getBoundingClientRect()

    const init = {
        bubbles: true,
        cancelable: true,
        composed: true,
        clientX: Math.round(rect.left + rect.width / 2),
        clientY: Math.round(rect.top + rect.height / 2),
        pointerId: 1,
        width: 1,
        height: 1,
        pressure: 0.5,
        isPrimary: true,
        pointerType: "mouse",
    }

    target.dispatchEvent(new PointerEvent("pointerdown", init))

    init.pressure = 0
    target.dispatchEvent(new PointerEvent("pointerup", init))
}