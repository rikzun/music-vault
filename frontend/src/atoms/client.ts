import { useAtom } from "@utils/hooks"
import { LocalStorage } from "@utils/localStorage"
import { atom } from "jotai"
import { ClientResponse } from "src/common/types"

export namespace ClientAtoms {
    export const client = atom<ClientResponse | null>((() => {
        const id = LocalStorage.getNumber("client.id")
        const login = LocalStorage.getString("client.login")
    
        if (!id || !login) return null
        return { id, login, avatarURL: null } as ClientResponse
    })())

    export const useClient = () => useAtom(client)
}