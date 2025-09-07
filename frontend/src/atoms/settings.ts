import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

const token = atom(localStorage.getItem("token"))

export namespace SettingsAtoms {
    export const useToken = () => useAtom(token)
}