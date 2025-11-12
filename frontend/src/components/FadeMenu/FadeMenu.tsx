import "./FadeMenu.style.scss"
import { useState } from "@utils/hooks"
import { CSSProperties, ElementType, PropsWithChildren, useEffect, useRef } from "react"
import { ReactEvent } from "@utils/react"

interface FadeMenuProps <T extends string> extends PropsWithChildren {
    type: T
    active?: T | null
    element?: ElementType | null
    className?: string | null
}

export function FadeMenu<T extends string>(props: FadeMenuProps<T>) {
    const activeRef = useRef(props.active)
    const opacity = useState(Number(props.type === props.active))
    const hide = useState(props.type !== props.active)

    useEffect(() => {
        const active = props.type === props.active

        if (active) hide.set(false)
        setTimeout(() => {
            requestAnimationFrame(() => {
                opacity.set(Number(active))
            })
        }, 1)

        activeRef.current = props.active
    }, [props.type, props.active])

    if (hide.value) return null

    const onTransitionEnd = (e: ReactEvent.Transition) => {
        console.log(e)
        if (e.propertyName !== "opacity") return

        const target = e.target as HTMLElement
        if (target.style.opacity !== "0") return

        hide.set(true)
    }

    const Element = props.element ?? "div"

    let className = "fade-menu"
    if (props.className) className += " " + props.className

    const style: CSSProperties = {
        opacity: opacity.value,
        pointerEvents: opacity.value == 0 ? "none" : undefined
    }

    return (
        <Element
            className={className}
            style={style}
            children={props.children}
            onTransitionEnd={onTransitionEnd}
        />
    )
}