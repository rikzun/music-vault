import { useAtom } from "@utils/hooks"
import { LocalStorage } from "@utils/localStorage"
import { atom } from "jotai"

export namespace PlaylistAtoms {
    // 0 for default uploaded playlist
    export const currentPlaylistID = atom(LocalStorage.getNumber("playlistID"))
    export const useCurrentPlaylistID = () => useAtom(currentPlaylistID)
}
