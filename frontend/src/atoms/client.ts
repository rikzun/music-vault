import { useAtom } from "@utils/hooks"
import { atom } from "jotai"
import { ClientResponse } from "src/common/types"

const client = atom<N<ClientResponse>>((() => {
    const id = Number(localStorage.getItem("client.id"))
    const login = localStorage.getItem("client.login")

    if (!id || !login) {
        return null
    }

    return { id, login, avatarURL: null } as ClientResponse
})())

export namespace ClientAtoms {
    export const useClient = () => useAtom(client)
}