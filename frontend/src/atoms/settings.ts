import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

namespace atoms {
    export const token = atom(localStorage.getItem('token'))
}

export const useTokenAtom = () => useAtom(atoms.token)