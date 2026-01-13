import { PopupMenuAtoms } from "@atoms/popupMenu"
import { popupMenuOptions } from "./PopupMenu.service"
import { useState } from "@utils/hooks"
import { useEffect, useRef } from "react"
import { Vector2 } from "src/types/types"
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight"

const PADDING = 16
const numbers = ["1", "2", "3", "4", "5", "6", "8", "9", "0"]

export function DefaultMenu() {
    const defaultMenuData = PopupMenuAtoms.useDefaultPosition()
    const pos = useState<Vector2 | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    const options = defaultMenuData.value?.type
        ? popupMenuOptions[defaultMenuData.value.type]
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

            option.onClick?.(defaultMenuData.value?.data)
            defaultMenuData.set(null)
        }
    }
    
    useEffect(() => {
        if (!defaultMenuData.value) {
            pos.set(null)
            return
        }

        let finalX = defaultMenuData.value.x
        let finalY = defaultMenuData.value.y

        const rect = ref.current?.getBoundingClientRect()!
        const availableWidth = document.body.clientWidth - PADDING
        const availableHeight = document.body.clientHeight - PADDING

        if (defaultMenuData.value.transformH == "center") finalX -= rect.width / 2
        if (defaultMenuData.value.transformH == "right") finalX -= rect.width

        if (defaultMenuData.value.transformV == "center") finalY -= rect.height / 2
        if (defaultMenuData.value.transformV == "bottom") finalY -= rect.height
        
        if (finalX < PADDING) finalX = PADDING
        if (finalX + rect.width > availableWidth) finalX = availableWidth - rect.width

        if (finalY < PADDING) finalY = PADDING
        if (finalY + rect.height > availableHeight) finalY = availableHeight - rect.height

        pos.set({x: finalX, y: finalY})

        addEventListener("keydown", onKeyDown, { passive: false })
        return () => removeEventListener("keydown", onKeyDown)
    }, [defaultMenuData.value])

    if (!defaultMenuData.value?.type) return null
    
    return (
        <div
            className="popup-menu-component popup-menu-component__default"
            ref={ref}
            style={{
                visibility: pos.value ? "visible" : "hidden",
                left: (pos.value?.x ?? 0) + "px",
                top: (pos.value?.y ?? 0) + "px",
            }}
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault() }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            children={
                options.map((option, index) => {
                    const onClick = () => {
                        option.onClick?.(defaultMenuData.value?.data)
                        defaultMenuData.set(null)
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
    )
}