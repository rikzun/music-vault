import { useAtom } from "@utils/hooks"
import { atom } from "jotai"
import { ClientResponse } from "src/common/types"

namespace client {
    export const client = atom<ClientResponse | null>(null)
}

export const useClientAtom = () => useAtom(client.client)