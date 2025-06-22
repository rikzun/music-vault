import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

namespace atoms {
    export const token = atom<string | null>(localStorage['token'] as string ?? null)
}

export const useTokenAtom = () => useAtom(atoms.token)