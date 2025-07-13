import type { IAudioMetadata } from "music-metadata"

export class TrackData {
    image: TrackImage | null
    title: string | null
    artists: string[]
    album: string | null
    codec: string | null
    bitrate: number | null
    lossless: boolean

    constructor(data: IAudioMetadata, image: TrackImage | null) {
        const bitrate = data.format.bitrate

        this.image = image
        this.title = data.common.title ?? null
        this.artists = data.common.artists ?? []
        this.album = data.common.album ?? null
        this.codec = data.format.codec ?? null
        this.bitrate = bitrate ? Math.round(bitrate) : null
        this.lossless = data.format.lossless ?? false
    }

    key() {
        return Object.entries(this).map(([key, value]) => {
            if (key == 'image') return key + ':' + (value != null)
            if (key == 'artists') return key + ':' + value.join('_')
            return key + ':' + value
        }).join('|')
    }
}

export interface TrackImage {
    data: Uint8Array
    objectURL: string
}

export type TrackWorkerMessage = {
    key: 'parse-metadata'
    data: File[]
} | {
    key: 'metadata-parsed'
    data: {
        data: IAudioMetadata[],
        images: TrackImage[]
    }
}