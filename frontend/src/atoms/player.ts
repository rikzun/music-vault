import { useAtom } from "@utils/hooks"
import { atom } from "jotai"
import { Track } from "src/common/types"

const currentTrack = atom<number | null>(null)
const trackList = atom<Map<number, Track>>(new Map())

export namespace PlayerAtoms {
    export const useCurrentTrack = () => useAtom(currentTrack)
    export const useTracklist = () => useAtom(trackList)
}
