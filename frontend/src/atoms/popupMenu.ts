import { useAtom } from "@utils/hooks"
import { atom } from "jotai"
import { PopupMenuInitiator } from "src/types/popupMenu"
import { Vector2 } from "src/types/types"

type PopupMenuData = Omit<Omit<PopupMenuInitiator, "anchorH">, "anchorV"> & Vector2

export namespace PopupMenuAtoms {
    export const defaultPosition = atom<PopupMenuData | null>(null)
    export const useDefaultPosition = () => useAtom(defaultPosition)
}