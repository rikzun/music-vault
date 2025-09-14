import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

const playlistID = atom(Number.parseInt(localStorage.getItem("playlistID") ?? "0")) // 0 for default uploaded playlist

export namespace PlaylistAtoms {
    export const usePlaylistID = () => useAtom(playlistID)
}
