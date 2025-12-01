import "./FadeMenu.style.scss"
import { useState } from "@utils/hooks"
import { CSSProperties, Children, ElementType, PropsWithChildren, ReactElement, cloneElement, isValidElement, useEffect, useMemo } from "react"

interface FadeMenuContainerProps extends PropsWithChildren {
    element?: ElementType | null
    className?: string | null
    active?: string | null
}

export function FadeMenuContainer(props: FadeMenuContainerProps) {
    const visible = useState(new Set(props.active))

    const children = useMemo(() => {
        const data = new Map<string, ReactElement<FadeMenuProps>>()

        Children.forEach(props.children, (child) => {
            if (!isValidElement<FadeMenuProps>(child)) return
            data.set(child.props.type, child)
        })

        return data
    }, [props.children])

    useEffect(() => {
        if (!props.active) return
        visible.set((prev) => new Set(prev).add(props.active!))
    }, [props.active])

    const Element = props.element ?? "div"

    let className = "fade-menu-container"
    if (props.className) className += " " + props.className
    
    return (
        <Element className={className}>
            {Array.from(children.entries()).map(([type, child]) => {
                const isActive = type === props.active
                const isVisible = visible.value.has(type)
        
                if (!isVisible) return null
        
                const style: CSSProperties = {
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? undefined : "none"
                }
        
                const onTransitionEnd: React.TransitionEventHandler = (e) => {
                    if (e.propertyName !== "opacity") return
                    if (isActive) return
            
                    visible.set((prev) => {
                        const newSet = new Set(prev)
                        newSet.delete(type)
                        return newSet
                    });
                };
        
                return cloneElement(child, { style, onTransitionEnd, key: type })
            })}
        </Element>
    )
}

interface FadeMenuProps extends PropsWithChildren {
    type: string
    element?: ElementType | null
    className?: string | null
    style?: CSSProperties;
    onTransitionEnd?: React.TransitionEventHandler;
}

export function FadeMenu(props: FadeMenuProps) {
    const Element = props.element ?? "div"

    let className = "fade-menu"
    if (props.className) className += " " + props.className

    return (
        <Element
            className={className}
            style={props.style}
            onTransitionEnd={props.onTransitionEnd}
            children={props.children}
        />
    )
}