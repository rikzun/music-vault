import { useAtom } from "@utils/hooks"
import { atom } from "jotai"
import { ClientResponse } from "src/common/types"

const client = atom<ClientResponse | null>(null)

export namespace ClientAtoms {
    export const useClient = () => useAtom(client)
}