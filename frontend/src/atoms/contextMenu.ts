import { useAtom } from "@utils/hooks"
import { atom } from "jotai"
import { ControlType, PrimitiveType, Vector2 } from "../types/global"
import { ContextMenuType, HorizontalPosition, VerticalPosition } from "@components/structure/ContextMenu/ContextMenu.types"

export interface ContextMenuData extends Partial<Vector2> {
    type: ContextMenuType
    data?: Record<string, PrimitiveType>
    transformH?: HorizontalPosition
    transformV?: VerticalPosition
    controlType: ControlType
}

export namespace ContextMenuAtoms {
    export const position = atom<ContextMenuData | null>(null)
    export const usePosition = () => useAtom(position)
}