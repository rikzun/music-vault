import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

namespace settings {
    export const token = atom(localStorage.getItem('token'))
}

export const useTokenAtom = () => useAtom(settings.token)