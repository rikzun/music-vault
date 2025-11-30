import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

export namespace BufferAtoms {
    export const playlistID = atom<number | null>(null)
    export const usePlaylistID = () => useAtom(playlistID)
}
