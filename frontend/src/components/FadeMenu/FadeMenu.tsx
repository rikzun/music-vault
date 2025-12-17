import "./FadeMenu.style.scss"
import { useState } from "@utils/hooks"
import { ReactEvent } from "@utils/react"
import { CSSProperties, Children, ElementType, PropsWithChildren, ReactElement, createContext, isValidElement, useContext, useEffect, useMemo, useRef } from "react"

interface FadeMenuContextType {
    firstRender: boolean
    active?: string | null
    transitionEnd: (type: string) => void
}
  
const FadeMenuContext = createContext({} as FadeMenuContextType)
const useFadeMenuContext = () => useContext(FadeMenuContext)

interface FadeMenuContainerProps extends PropsWithChildren {
    element?: ElementType | null
    className?: string | null
    active?: string | null
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
        if (!props.active) {
            visible.set(new Set())
            return
        }

        visible.set((prev) => {
            const newSet = new Set(prev)
            newSet.add(props.active!)
            return newSet
        })

        return () => {
            firstRender.current = false
        }
    }, [props.active])

    const transitionEnd = (type: string) => {
        visible.set((prev) => {
            const newSet = new Set(prev)
            newSet.delete(type)
            return newSet
        })
    }

    const Element = props.element ?? "div"

    let className = "fade-menu-container"
    if (props.className) className += " " + props.className
    
    return (
        <Element className={className}>
            <FadeMenuContext.Provider value={{ firstRender: firstRender.current, active: props.active, transitionEnd }}>
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
        opacity.set(Number(context.active == props.type))
    }, [context.active, props.type])

    const style: CSSProperties = {
        opacity: opacity.value,
        pointerEvents: opacity.value == 0 ? "none" : undefined
    }

    const onTransitionEnd = (e: ReactEvent.Transition) => {
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