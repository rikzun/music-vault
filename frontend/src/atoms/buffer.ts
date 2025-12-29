import { useAtom } from "@utils/hooks"
import { atom } from "jotai"
import { bufferAddTrack, bufferRemoveTrack } from "src/App"

export namespace BufferAtoms {
    export const playlistID = atom<number | null, [number | null], void>(
        null,
        (_, set, update) => {
            if (update) {
                bufferAddTrack.setInfo(update)
                bufferRemoveTrack.setInfo(update)
            } else {
                bufferAddTrack.flush()
                bufferRemoveTrack.flush()
            }
            
            set(playlistID, update)
        }
    )

    export const usePlaylistID = () => useAtom(playlistID)
}
