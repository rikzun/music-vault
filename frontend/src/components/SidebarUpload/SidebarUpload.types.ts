import type { IAudioMetadata } from "music-metadata"

export interface TrackImage {
    data: ArrayBuffer
    objectURL: string
}

export class TrackData {
    file: File
    image: TrackImage | null
    title: stringN
    artists: string[]
    album: stringN
    codec: stringN
    bitrate: numberN
    lossless: boolean

    id: numberN = null
    progress: numberN = null
    status: TrackStatus | null = null

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

        return new TextEncoder()
            .encode(meta)
            .buffer as ArrayBuffer
    }

    extractImage() {
        return this.image?.data ?? new ArrayBuffer(0)
    }

    key() {
        const values: string[] = []

        Object.entries(this).forEach(([key, value]) => {
            switch (key) {
                case "file": return

                case "image": {
                    values.push(key + ":" + (value != null))
                    return
                }

                case "artists": {
                    value.forEach((artist: string) => {
                        values.push("artist:" + artist)
                    })
                    return
                }

                default: {
                    values.push(key + ":" + value)
                }
            }
        })

        return values.join("|")
    }
}

type TrackStatus =
    | "unknown_error"