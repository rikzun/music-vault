import "./FadeMenu.style.scss"
import { useState } from "@utils/hooks"
import { ReactEvent } from "@utils/react"
import { CSSProperties, Children, ElementType, PropsWithChildren, ReactElement, createContext, isValidElement, useContext, useEffect, useMemo, useRef } from "react"

interface FadeMenuContextType {
    firstRender: boolean
    active: string
    duration: number
    transitionEnd: (type: string) => void
}
  
const FadeMenuContext = createContext({} as FadeMenuContextType)
const useFadeMenuContext = () => useContext(FadeMenuContext)

interface FadeMenuContainerProps extends PropsWithChildren {
    element?: ElementType | null
    className?: string | null
    active: string
    duration?: number | null
}

export function FadeMenuContainer(props: FadeMenuContainerProps) {
    const firstRender = useRef(true)
    const visible = useState(new Set([props.active]))

    const children = useMemo(() => {
        const data = new Map<string, ReactElement<FadeMenuProps>>()

        Children.forEach(props.children, (child) => {
            if (!isValidElement<FadeMenuProps>(child)) return
            data.set(child.props.type, child)
        })

        return data
    }, [props.children])

    useEffect(() => {
        firstRender.current = false
    }, [])

    const transitionEnd = (type: string) => {
        visible.set((prev) => {
            const newSet = new Set(prev)
            newSet.delete(type)
            newSet.add(props.active)
            return newSet
        })
    }

    const Element = props.element ?? "div"

    let className = "fade-menu-container"
    if (props.className) className += " " + props.className

    const providerValue: FadeMenuContextType = {
        firstRender: firstRender.current,
        active: props.active,
        duration: props.duration ?? 0.2,
        transitionEnd
    }
    
    return (
        <Element className={className}>
            <FadeMenuContext.Provider value={providerValue}>
                {Array.from(children.entries()).map(([type, child]) => {
                    const isVisible = visible.value.has(type)
                    if (!isVisible) return null

                    return child
                })}
            </FadeMenuContext.Provider>
        </Element>
    )
}

interface FadeMenuProps extends PropsWithChildren {
    type: string
    element?: ElementType | null
    className?: string | null
}

export function FadeMenu(props: FadeMenuProps) {
    const context = useFadeMenuContext()
    const opacity = useState(context.firstRender ? 1 : 0)

    const Element = props.element ?? "div"

    let className = "fade-menu"
    if (props.className) className += " " + props.className

    useEffect(() => {
        opacity.set(1)
    }, [])

    useEffect(() => {
        opacity.set(Number(context.active == props.type))
    }, [context.active, props.type])

    const style: CSSProperties = {
        opacity: opacity.value,
        transitionDuration: context.duration + "s",
        pointerEvents: opacity.value == 0 ? "none" : undefined
    }

    const onTransitionEnd = (e: ReactEvent.Transition) => {
        if (e.target !== e.currentTarget) return
        if (e.propertyName !== "opacity") return
        if ((e.target as HTMLElement).style.opacity == "1") return

        context.transitionEnd(props.type)
    }

    return (    
        <Element
            className={className}
            style={style}
            onTransitionEnd={onTransitionEnd}
            children={props.children}
        />
    )
}