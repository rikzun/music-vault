import { ReactEvent } from "@utils/react"
import { useRef } from "react"

export type TrueClickHandler<T extends Element> = (e: ReactEvent.Pointer<T>) => void

export interface TrueClickHook<T extends Element> {
    onPointerDown: (e: ReactEvent.Pointer<T>) => void
    onPointerUp: (e: ReactEvent.Pointer<T>) => void
    onPointerLeave: (e: ReactEvent.Pointer<T>) => void
    onPointerCancel: (e: ReactEvent.Pointer<T>) => void
    onKeyUp: (e: ReactEvent.Keyboard<T>) => void
}

export function useTrueClick<T extends Element>(handler?: TrueClickHandler<T> | null, skipButtonCheck?: boolean): TrueClickHook<T> {
    const isPointerDown = useRef(false)

    const onPointerDown = (e: ReactEvent.Pointer<T>) => {
        if (e.button !== 0 && skipButtonCheck) return
        isPointerDown.current = true
    }

    const onPointerUp = (e: ReactEvent.Pointer<T>) => {
        if (!isPointerDown.current) return
        isPointerDown.current = false

        handler?.(e)
    }

    const onPointerLeave = () => {
        isPointerDown.current = false
    }

    const onPointerCancel = () => {
        isPointerDown.current = false
    }

    return {
        onPointerDown,
        onPointerUp,
        onPointerLeave,
        onPointerCancel,
        onKeyUp: handleEnter
    }
}

function handleEnter<T extends Element>(e: ReactEvent.Keyboard<T>) {
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