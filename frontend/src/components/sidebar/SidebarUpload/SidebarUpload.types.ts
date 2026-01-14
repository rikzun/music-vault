export interface TrackImage {
    blob: Blob
    objectURL: string
}

export interface IUploadTrack {
    key: number
    notAnAudio: boolean
    progress: number
    
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