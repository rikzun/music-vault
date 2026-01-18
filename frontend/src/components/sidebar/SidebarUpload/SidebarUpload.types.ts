export interface TrackImage {
    blob: Blob
    objectURL: string
}

export type UploadTrackError =
    | "unknown_error"

export interface IUploadTrack {
    key: number
    progress: number | null
    errorStatus: UploadTrackError | null
    
    file: File
    meta: IUploadTrackMeta | null
}

export interface IUploadTrackMeta {
    image: TrackImage | null
    title: string | null
    artists: string[]
    album: string | null
    codec: string | null
    bitrate: number | null
    lossless: boolean
}