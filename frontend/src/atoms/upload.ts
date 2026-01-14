import { IUploadTrack } from "@components/sidebar/SidebarUpload"
import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

export namespace UploadAtoms {
    export const sidebarMenu = atom<IUploadTrack[]>([])
    export const useSidebarMenu = () => useAtom(sidebarMenu)
}