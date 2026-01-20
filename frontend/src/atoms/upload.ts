import { IUploadTrack } from "@components/sidebar/SidebarUpload"
import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

export namespace UploadAtoms {
    export const tracks = atom<IUploadTrack[]>([])
    export const useTracks = () => useAtom(tracks)

    export const isUploading = atom<boolean>(false)
    export const useIsUploading = () => useAtom(isUploading)
}