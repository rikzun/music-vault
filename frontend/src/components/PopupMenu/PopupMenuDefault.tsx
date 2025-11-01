import { PopupMenuAtoms } from "@atoms/popupMenu"
import { options } from "@components/PopupMenu/PopupMenu.service"
import { useState } from "@utils/hooks"
import { useEffect, useRef } from "react"
import { Vector2 } from "src/common/types"

const PADDING = 16

export function DefaultMenu() {
    const defaultMenuData = PopupMenuAtoms.useDefaultPosition()
    const pos = useState<Vector2 | null>(null)
    const ref = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        if (!defaultMenuData.value) {
            pos.set(null)
            return
        }

        let finalX = defaultMenuData.value.x
        let finalY = defaultMenuData.value.y

        const rect = ref.current?.getBoundingClientRect()!

        switch(defaultMenuData.value.transformH) {
            case "center": { finalX -= rect.width / 2; break }
            case "right": { finalX -= rect.width     ; break }
        }

        switch(defaultMenuData.value.transformV) {
            case "center": { finalY -= rect.height / 2; break }
            case "bottom": { finalY -= rect.height    ; break }
        }

        const availableWidth = document.body.clientWidth - PADDING
        const availableHeight = document.body.clientHeight - PADDING

        if (finalX < PADDING) finalX = PADDING
        if (finalX + rect.width > availableWidth) finalX = availableWidth - rect.width

        if (finalY < PADDING) finalY = PADDING
        if (finalY + rect.height > availableHeight) finalY = availableHeight - rect.height

        pos.set({x: finalX, y: finalY})
        ref.current!.focus()
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
        >
            {options[defaultMenuData.value?.type].map((value, index) => (
                <button className="option" key={value + "_" + index}>
                    <div className="count">{index + 1}</div>
                    <div className="text">{value}</div>
                </button>
            ))}
        </div>
    )
}