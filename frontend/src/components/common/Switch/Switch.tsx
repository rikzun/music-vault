import { useTrueClick } from "@utils/hooks/useTrueClick"
import "./Switch.style.scss"
import { Children, CSSProperties, isValidElement, PropsWithChildren, ReactNode, useLayoutEffect, useMemo, useRef } from "react"
import { Divider } from "@components/common/Divider"

interface SwitchContainerProps extends PropsWithChildren {
    optionWidth?: string | null
}

interface SwitchOptionProps {
    label: string
    onSelect?: () => void
    active?: boolean | null
}

interface ChildData {
    props: SwitchOptionProps[]
    elements: ReactNode[]
}

export namespace Switch {
    export function Container(props: SwitchContainerProps) {
        const ref = useRef<HTMLDivElement>(null)

        const childData = useMemo(() => {
            const style = props.optionWidth
                ? {width: props.optionWidth}
                : undefined

            const data: ChildData = {
                props: [],
                elements: []
            }

            Children.forEach(props.children, (child, index) => {
                if (!isValidElement<SwitchOptionProps>(child)) return null
                const props = child.props

                const element = (
                    <button
                        key={props.label}
                        type="button"
                        data-index={index}
                        style={style}
                        children={props.label}
                    />
                )

                data.props.push(props)
                data.elements.push(element)
            })

            const labels = data.props.map((v) => v.label)
            if (new Set(labels).size !== labels.length) {
                console.error("Dublicated labels in Switch component")
            }

            for (let i = 1; i < data.elements.length; i += 2) {
                const element = (
                    <Divider
                        key={"divider" + i}
                        char="slash"
                        size="auto"
                    />
                )

                data.elements.splice(i, 0, element)
            }

            return data
        }, [props.children])

        const trueClick = useTrueClick((e) => {
            const target = (e.target as HTMLButtonElement)
            const childProps = childData.props.find((v) => v.label === target.textContent)
            childProps?.onSelect?.()
        })

        useLayoutEffect(() => {
            const activeIndex = childData.props.findIndex((v) => v.active)
            if (activeIndex == -1) return

            const container = document.querySelector('.switch-container-component')
            const activeElement = container?.querySelector(`button[data-index="${activeIndex}"]`)

            if (!activeElement || !container || !ref.current) return

            const rect = activeElement.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()

            const underline = ref.current

            underline.style.width = rect.width + 'px'
            underline.style.top = rect.top - containerRect.top + rect.height + 'px'
            underline.style.left = rect.left - containerRect.left + "px"
        }, [childData])

        return (
            <div className="switch-container-component" {...trueClick}>
                {childData.elements}

                <div ref={ref} className="underline" />
            </div>
        )
    }

    export function Option(props: SwitchOptionProps) {
        return null
    }
}
