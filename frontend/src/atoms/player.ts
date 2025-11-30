import { useAtom } from "@utils/hooks"
import { atom } from "jotai"
import { Track } from "src/types/types"

export namespace PlayerAtoms {
    export const currentTrack = atom<number | null>(null)
    export const useCurrentTrack = () => useAtom(currentTrack)

    export const trackList = atom<Map<number, Track>>(new Map())
    export const useTracklist = () => useAtom(trackList)
}
