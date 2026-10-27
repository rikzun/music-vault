import "./ContextMenu.styles.scss"
import { ContextMenuAtoms } from "@atoms/contextMenu"
import { Fragment, useEffect, useLayoutEffect, useRef } from "react"
import { contextMenuOptions } from "./ContextMenu.data"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"
import { createPortal } from 'react-dom'
import { Plane } from "@components/common/Plane"
import { useState } from "@utils/hooks"
import { Vector2 } from "@types"
import { ContextMenuItem } from "./ContextMenu.types"

const PADDING = 16
const numbers = ["1", "2", "3", "4", "5", "6", "8", "9", "0"]

export function ContextMenu() {
    const data = ContextMenuAtoms.useData()
    const finalPos = useState<Vector2 | null>(null)
    const finalNestedPos = useState<Vector2 | null>(null)
    const nestedOptionChosen = useState<ContextMenuItem | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    const isMouse = data.value?.controlType === "mouse"

    let className = "context-menu-component"
    if (isMouse) className += " " + className + "__mouse"
    else className += " " + className + "__touch"

    const options = data.value?.type
        ? contextMenuOptions[data.value.type]
        : []

    const onKeyDown = (e: KeyboardEvent) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur()
        }

        if (numbers.includes(e.key)) {
            const index = e.key !== "0"
                ? Number(e.key) - 1
                : 9

            const option = options[index]
            if (!option) return

            option.onClick?.(data.value?.data)

            if (!option.children) {
                data.set(null)
            }
        }
    }

    useEffect(() => {
        const listener = (e: MouseEvent) => {
            e.preventDefault()
        }

        document.body.addEventListener("contextmenu", listener)
        return () => document.body.removeEventListener("contextmenu", listener)
    }, [])

    useLayoutEffect(() => {
        if (!data.value) {
            finalPos.set(null)
            finalNestedPos.set(null)
            return
        }

        if (!isMouse) {
            finalPos.set({x: 0, y: 0})
            return
        }

        let finalX = data.value.x!
        let finalY = data.value.y!

        const rect = ref.current?.getBoundingClientRect()!
        const availableWidth = document.body.clientWidth - PADDING
        const availableHeight = document.body.clientHeight - PADDING

        if (data.value.transformH == "center") finalX -= rect.width / 2
        if (data.value.transformH == "right") finalX -= rect.width

        if (data.value.transformV == "center") finalY -= rect.height / 2
        if (data.value.transformV == "bottom") finalY -= rect.height
        
        if (finalX < PADDING) finalX = PADDING
        if (finalX + rect.width > availableWidth) finalX = availableWidth - rect.width

        if (finalY < PADDING) finalY = PADDING
        if (finalY + rect.height > availableHeight) finalY = availableHeight - rect.height

        finalPos.set({x: finalX, y: finalY})

        addEventListener("keydown", onKeyDown, { passive: false })
        return () => removeEventListener("keydown", onKeyDown)
    }, [data.value])

    const calculateNestedFinalPos = (option: ContextMenuItem, index: number) => {
        const rect = ref.current?.getBoundingClientRect()!
        const availableWidth = document.body.clientWidth - PADDING - rect.width
        const availableHeight = document.body.clientHeight - PADDING

        let finalX = rect.x
        let finalY = rect.y

        let oneOptionSize = (rect.height / options.length) * index

        finalX += rect.width
        finalY += oneOptionSize
        
        if (finalX + rect.width > availableWidth) finalX = finalX - (rect.width * 2) - PADDING
        // obviously buggy line
        // if (finalY + (oneOptionSize * option.children?.length!) > availableHeight) finalY = finalY - (rect.width * 2) - PADDING

        nestedOptionChosen.set(option)
        finalNestedPos.set({x: finalX, y: finalY})
    }

    return createPortal(
        <Fragment>
            {/* first menu */}
            <Fragment>
                {finalPos.value && (
                    <Plane
                        onPointerDown={() => {
                            data.set(null)
                        }}
                    />
                )}

                <div
                    className={className}
                    ref={ref}
                    style={{
                        visibility: finalPos.value ? "visible" : "hidden",
                        left: finalPos.value?.x ? finalPos.value?.x + "px" : undefined,
                        top: finalPos.value?.y ? finalPos.value?.y + "px" : undefined,
                    }}
                    children={
                        options.map((option, index) => {
                            const onClick = () => {
                                if (option.children) {
                                    calculateNestedFinalPos(option, index)
                                }

                                option.onClick?.(data.value?.data)
                                if (!option.children) {
                                    data.set(null)
                                }
                            }

                            let count: number | null = index + 1
                            if (index == 9) count = 0
                            if (index > 9) count = null

                            return (
                                <button className="option" key={option.label} onClick={onClick}>
                                    <div className="count">{count}</div>

                                    <div className="text">
                                        {option.label}
                                    </div>

                                    {Boolean(option.children?.length) &&
                                        <KeyboardArrowRight className="arrow" />
                                    }
                                </button>
                            )
                        })
                    }
                />
            </Fragment>

            {/* nested menu */}
            <Fragment>
                <div
                    className={className}
                    style={{
                        visibility: finalNestedPos.value ? "visible" : "hidden",
                        left: finalNestedPos.value?.x ? finalNestedPos.value?.x + "px" : undefined,
                        top: finalNestedPos.value?.y ? finalNestedPos.value?.y + "px" : undefined,
                    }}
                    children={
                        nestedOptionChosen.value?.children?.map((option, index) => {
                            const onClick = () => {
                                option.onClick?.(data.value?.data)
                                data.set(null)
                            }

                            return (
                                <button className="option" key={option.label} onClick={onClick}>
                                    <div className="text">
                                        {option.label}
                                    </div>
                                </button>
                            )
                        })
                    }
                />
            </Fragment>
        </Fragment>,
        document.body
    )
}