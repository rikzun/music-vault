import { useAtom } from "@utils/hooks"
import { LocalStorage } from "@utils/localStorage"
import { atom } from "jotai"

export namespace VolumeAtoms {
    export const value = atom(LocalStorage.getNumber("volume.value", 50))
    export const useVolume = () => useAtom(value)

    export const muted = atom(LocalStorage.getBoolean("volume.muted") ?? false)
    export const useMuted = () => useAtom(muted)
}