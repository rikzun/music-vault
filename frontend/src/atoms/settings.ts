import { useAtom } from "@utils/hooks/useAtom"
import { atom } from "jotai"

namespace atoms {
    export const token = atom<string | null>(null)
}

export const useTokenAtom = () => useAtom(atoms.token)