import type { IAudioMetadata } from "music-metadata"

export interface TrackImage {
    data: Uint8Array
    objectURL: string
}

export class TrackData {
    file: File
    image: TrackImage | null
    title: string | null
    artists: string[]
    album: string | null
    codec: string | null
    bitrate: number | null
    lossless: boolean

    constructor(file: File, data: IAudioMetadata, image: TrackImage | null = null) {
        const bitrate = data.format.bitrate

        this.file = file
        this.image = image
        this.title = data.common.title ?? null
        this.artists = data.common.artists ?? []
        this.album = data.common.album ?? null
        this.codec = data.format.codec ?? null
        this.bitrate = bitrate ? Math.round(bitrate) : null
        this.lossless = data.format.lossless ?? false
    }

    extractMetadata() {
        const meta = JSON.stringify({
            title: this.title,
            artists: this.artists,
            album: this.album,
            codec: this.codec,
            bitrate: this.bitrate,
            lossless: this.lossless
        })

        const encoder = new TextEncoder()
        return encoder.encode(meta).buffer
    }

    extractImage() {
        return this.image?.data?.buffer ?? new ArrayBuffer(0)
    }

    key() {
        const values: string[] = []

        Object.entries(this).forEach(([key, value]) => {
            switch (key) {
                case 'file': return

                case 'image': {
                    values.push(key + ':' + (value != null))
                    return
                }

                case 'artists': {
                    values.push(key + ':' + value.join('+'))
                    return
                }

                default: {
                    values.push(key + ':' + value)
                }
            }
        })

        return values.join('|')
    }
}