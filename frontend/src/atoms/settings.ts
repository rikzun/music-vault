import { useAtom } from "@utils/hooks"
import { LocalStorage } from "@utils/localStorage"
import { atom } from "jotai"

export namespace SettingsAtoms {
    export const token = atom(LocalStorage.getString("token"))
    export const useToken = () => useAtom(token)
}