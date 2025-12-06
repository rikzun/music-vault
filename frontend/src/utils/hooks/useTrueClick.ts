import { handleEnter } from "@utils/events"
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

export function useTrueClick<T extends Element>(handler?: TrueClickHandler<T>): TrueClickHook<T> {
    const isPointerDown = useRef(false)

    const onPointerDown = (e: ReactEvent.Pointer<T>) => {
        if (e.button !== 0) return
        isPointerDown.current = true
    }

    const onPointerUp = (e: ReactEvent.Pointer<T>) => {
        if (!isPointerDown.current) return
        isPointerDown.current = false

        handler?.(e)
    }

    const onPointerLeave = (e: ReactEvent.Pointer<T>) => {
        isPointerDown.current = false
    }

    const onPointerCancel = (e: ReactEvent.Pointer<T>) => {
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