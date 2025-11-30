import "./FadeMenu.style.scss"
import { useState } from "@utils/hooks"
import { CSSProperties, Children, ElementType, PropsWithChildren, ReactElement, cloneElement, isValidElement, useEffect, useMemo } from "react"

interface FadeMenuContainerProps extends PropsWithChildren {
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
    
    return (
        <>
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
        </>
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

// interface FadeMenuProps <T extends string> extends PropsWithChildren {
//     type: T
//     active?: T | null
//     element?: ElementType | null
//     className?: string | null
// }

// export function FadeMenu<T extends string>(props: FadeMenuProps<T>) {
//     const activeRef = useRef(props.active)
//     const opacity = useState(Number(props.type === props.active))
//     const hide = useState(props.type !== props.active)

//     useEffect(() => {
//         const active = props.type === props.active

//         if (active) hide.set(false)
//         setTimeout(() => {
//             requestAnimationFrame(() => {
//                 opacity.set(Number(active))
//             })
//         }, 1)

//         activeRef.current = props.active
//     }, [props.type, props.active])

//     if (hide.value) return null

//     const onTransitionEnd = (e: ReactEvent.Transition) => {
//         if (e.propertyName !== "opacity") return

//         const target = e.target as HTMLElement
//         if (target.style.opacity !== "0") return

//         hide.set(true)
//     }

//     const Element = props.element ?? "div"

//     let className = "fade-menu"
//     if (props.className) className += " " + props.className

//     const style: CSSProperties = {
//         opacity: opacity.value,
//         pointerEvents: opacity.value == 0 ? "none" : undefined
//     }

//     return (
//         <Element
//             className={className}
//             style={style}
//             children={props.children}
//             onTransitionEnd={onTransitionEnd}
//         />
//     )
// }