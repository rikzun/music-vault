export interface SignResponse {
    token: string
}

export interface ClientResponse {
    id: number
    login: string
    avatarURL?: string
}

export interface Track {
    id: number
    audioURL: string
    imageURL: string
}
