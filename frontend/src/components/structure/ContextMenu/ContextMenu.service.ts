import { getDefaultStore } from "jotai"
import { ContextMenuPosition, ContextMenuType } from "./ContextMenu.types"
import { ContextMenuAtoms, ContextMenuData } from "@atoms/contextMenu"
import { ControlType } from "../../../types/global"
import { ReactEvent } from "@utils/react"

const LONG_PRESS_MS = 500

let timerID: number | undefined
let longPressFired = false

function show(type: ContextMenuType, controlType: ControlType, x: number, y: number, position?: ContextMenuPosition) {
    navigator.vibrate?.(50)

    const data: ContextMenuData = {
        type: type,
        x: x,
        y: y,
        transformH: position?.transformH,
        transformV: position?.transformV,
        controlType: controlType
    }

    getDefaultStore().set(ContextMenuAtoms.data, data)
}

export function openContextMenu(type: ContextMenuType) {
    return {
        onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
            clearTimeout(timerID)
            longPressFired = false

            if (e.pointerType === "mouse") return

            const ac = new AbortController()
            const cancel = () => {
                clearTimeout(timerID)
                ac.abort()
            }

            e.currentTarget.addEventListener("pointerup", cancel, { signal: ac.signal })
            e.currentTarget.addEventListener("pointercancel", cancel, { signal: ac.signal })
            e.currentTarget.addEventListener("pointerleave", cancel, { signal: ac.signal })

            timerID = window.setTimeout(() => {
                ac.abort()
                longPressFired = true

                show(type, "touch", e.pageX, e.pageY)
            }, LONG_PRESS_MS)
        },

        onContextMenu: (e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault()
            clearTimeout(timerID)

            let isPointerTouch = false
            if (e.nativeEvent instanceof PointerEvent) {
                isPointerTouch = e.nativeEvent.pointerType != "mouse"
            }

            const controlType = longPressFired || isPointerTouch
                ? "touch"
                : "mouse"

            if (longPressFired) {
                longPressFired = false
                return
            }

            show(type, controlType, e.pageX, e.pageY)
        }
    }
}

export function triggerContextMenu(type: ContextMenuType, position?: ContextMenuPosition) {
    return {
        onClick(e: ReactEvent.Mouse<HTMLElement>) {
            let isPointerTouch = false
            if (e.nativeEvent instanceof PointerEvent) {
                isPointerTouch = e.nativeEvent.pointerType != "mouse" && e.detail != 0
            }

            const controlType = isPointerTouch
                ? "touch"
                : "mouse"
            
            const target = e.currentTarget as HTMLElement
            const rect = target.getBoundingClientRect()

            let x!: number
            let y!: number

            switch (position?.anchorH) {
                default:
                case "left": {
                    x = rect.left
                    break
                }

                case "center": {
                    x = rect.left + (rect.width / 2)
                    break
                }

                case "right": {
                    x = rect.right
                    break
                }
            }

            switch (position?.anchorV) {
                default:
                case "top": {
                    y = rect.top
                    break
                }

                case "center": {
                    y = rect.top + (rect.height / 2)
                    break
                }

                case "bottom": {
                    y = rect.bottom
                    break
                }
            }

            show(type, controlType, x, y, position)
        }
    }
}
