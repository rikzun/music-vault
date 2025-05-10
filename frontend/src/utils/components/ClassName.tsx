import { ReactNode, cloneElement, isValidElement } from "react"

type ClassNameProps =
    { children: ReactNode } &
    { [key: string]: any }

export function ClassName(props: ClassNameProps) {
    const classes = Object.entries(props)
        .filter(([key, value]) => key != 'children' && value)
        .map(([key, _]) => key)
        .join(' ')

    if (isValidElement(props.children)) {
        const currentClasses = props.children.props.className as string ?? ''

        return cloneElement(props.children, {
            //@ts-ignore
            className: [currentClasses, classes].join(' ')
        })
    }

    return props.children
}