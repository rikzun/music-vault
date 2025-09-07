import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

const value = atom(Number.parseFloat(localStorage.getItem("volume.value") ?? "50"))
const muted = atom(localStorage.getItem("volume.muted") === "true")

export namespace VolumeAtoms {
    export const useVolume = () => useAtom(value)
    export const useMuted = () => useAtom(muted)
}