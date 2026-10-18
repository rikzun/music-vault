import "./Ripple.styles.scss"
import { useCallback, useEffect, useRef } from "react"
import { RippleItem, RippleProps } from "./Ripple.types"
import { ReactEvent } from "@utils/react"
import { useState } from "@utils/hooks"

const DURATION = 550

export function Ripple(props: RippleProps) {
    const rootRef = useRef<HTMLSpanElement>(null)
    const ripples = useState<RippleItem[]>([])

    const nextKey = useRef(0)
    const activeKeys = useRef<number[]>([])
    const removeTimers = useRef(new Set<number>())

    useEffect(() => {
        return () => {
            removeTimers.current
                .forEach(clearTimeout)
        }
    }, [])

    const startCommit = useCallback((rippleX: number, rippleY: number, rippleSize: number) => {
        const key = nextKey.current++
        activeKeys.current.push(key)

        ripples.set((state) => {
            return [
                ...state,
                {
                    key: key,
                    leaving: false, 
                    size: rippleSize,
                    x: rippleX,
                    y: rippleY
                }
            ]
        })
    }, [])

    const start = useCallback((event: ReactEvent.Pointer) => {
        const rect = rootRef.current!
            .getBoundingClientRect()

        const rippleX = Math.round(event.clientX - rect.left)
        const rippleY = Math.round(event.clientY - rect.top)

        const sizeX = Math.max(Math.abs(rect.width - rippleX), rippleX) * 2 + 2
        const sizeY = Math.max(Math.abs(rect.height - rippleY), rippleY) * 2 + 2

        const rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2)

        startCommit(rippleX, rippleY, rippleSize)
    }, [])

    const stop = useCallback(() => {
        const key = activeKeys.current.shift()
        if (key === undefined) return

        ripples.set((state) => {
            const index = state.findIndex((state) => state.key == key)
            if (index != -1) {
                state[index].leaving = true
            }
            
            return [...state]
        })

        const timer = setTimeout(() => {
            removeTimers.current.delete(timer)

            ripples.set((state) => {
                return state.filter((v) => v.key !== key)
            })
        }, DURATION)

        removeTimers.current.add(timer)
    }, [])

    const Tag = props.tag ?? "div"

    return (
        <Tag
            className="ripple-component"
            onPointerDown={(e: ReactEvent.Pointer) => {
                if (props.disabled) return
                start(e)
            }}
            onPointerUp={stop}
            onPointerLeave={stop}
            onPointerMove={stop}
            onContextMenu={(e: ReactEvent.Mouse) => {
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            {props.children}

            <span className="ripple__root" ref={rootRef}>
                {ripples.value.map((v) => {
                    let childClass = "ripple__child"
                    if (v.leaving) childClass += " ripple__child--leaving"

                    return (
                        <span
                            key={v.key}
                            className="ripple__wave"
                            style={{
                                width: v.size,
                                height: v.size,
                                top: -(v.size / 2) + v.y,
                                left: -(v.size / 2) + v.x,
                            }}
                        >
                            <span className={childClass} />
                        </span>
                    )
                })}
            </span>
        </Tag>
    )
}