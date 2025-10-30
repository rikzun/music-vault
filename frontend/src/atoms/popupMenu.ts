import { useAtom } from "@utils/hooks"
import { atom } from "jotai"
import { PopupMenuInitiator, PopupMenuType } from "src/common/popupMenu"
import { Vector2 } from "src/common/types"

type PopupMenuData = Omit<Omit<PopupMenuInitiator, "anchorH">, "anchorV"> & Vector2

export namespace PopupMenuAtoms {
    export const defaultPosition = atom<PopupMenuData | null>(null)
    export const useDefaultPosition = () => useAtom(defaultPosition)
}