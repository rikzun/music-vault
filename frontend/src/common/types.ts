export interface SignResponse {
    token: string
}

export interface ClientResponse {
    id: number
    login: string
    avatarURL: stringN
}

export interface Track {
    id: number
    uploaderID: number

    audioURL: string
    imageURL: string

    title: string
    album: stringN
    codec: string
    bitrate: number
    lossless: boolean

    duration: number

    artists: TrackArsits[]
}

export interface TrackArsits {
    id: number
    name: string
}