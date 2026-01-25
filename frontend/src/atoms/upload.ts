import { IUploadTrack } from "@components/sidebar/SidebarUpload"
import { useAtom } from "@utils/hooks"
import { atom } from "jotai"

export namespace UploadAtoms {
    export const tracks = atom<IUploadTrack[]>([])
    export const useTracks = () => useAtom(tracks)

    export const isUploading = atom(false)
    export const useIsUploading = () => useAtom(isUploading)
    
    export const currentEditKey = atom<null | number>(null)
    export const useCurrentEditKey = () => useAtom(currentEditKey)
    
    export const currentEditTrackData = atom<TrackEditFields | null>(null)
    export const useCurrentTrackData = () => useAtom(currentEditTrackData)
}

export interface TrackEditFields {
    title: string
    artists: string[]
    album: string
}