import { PlaylistShortData } from "@components/SidebarPlaylist/SidebarPlaylist.types"
import { useAtom } from "@utils/hooks"
import { LocalStorage } from "@utils/localStorage"
import { atom } from "jotai"

export namespace PlaylistAtoms {
    /** `0` for default uploaded playlist */
    export const currentPlaylistID = atom(LocalStorage.getNumber("playlistID", 0))
    export const useCurrentPlaylistID = () => useAtom(currentPlaylistID)

    export const playlists = atom<PlaylistShortData[]>([])
    export const usePlaylists = () => useAtom(playlists)
}
