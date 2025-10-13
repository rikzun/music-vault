import { useState } from "@utils/hooks"
import { useEffect, useRef } from "react"
import { Position } from "src/common/types"

export interface DefaultContextMenuData {
    xPos: number
    yPos: number
}

export interface DefaultMenuProps {
    data: DefaultContextMenuData
}

const PADDING = 16

export function DefaultMenu(props: DefaultMenuProps) {
    const pos = useState<Position | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let finalX = props.data.xPos
        let finalY = props.data.yPos

        const rect = ref.current!.getBoundingClientRect()
        const right = finalX + rect.width + PADDING
        const bottom = finalY + rect.height + PADDING

        if (right > document.body.clientWidth) {
            finalX = document.body.clientWidth - rect.width - PADDING
        }

        if (bottom > document.body.clientHeight) {
            finalY = document.body.clientHeight - rect.height - PADDING
        }

        pos.set({x: finalX, y: finalY})
    }, [props.data.xPos, props.data.yPos])

    return (
        <div
            className="contextmenu-component contextmenu-component__default"
            ref={ref}
            style={{
                visibility: pos.value ? "visible" : "hidden",
                left: pos.value ? pos.value.x + "px" : undefined,
                top: pos.value ? pos.value.y + "px" : undefined
            }}
            onContextMenu={(e) => { e.stopPropagation(); e.preventDefault() }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
        >
            <div>option 1</div>
            <div>option 2</div>
            <div>option 3</div>
            <div>option 4</div>
        </div>
    )
}