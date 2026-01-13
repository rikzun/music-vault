import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

type MenuItems =
    | "Playlists"
    | "Friends"
    | "RoomChat"
    | "Search"
    | "Upload"

export namespace MenuAtoms {
    export const sidebarMenu = atom<MenuItems>("Playlists")
    export const useSidebarMenu = () => useAtom(sidebarMenu)
}