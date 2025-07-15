import { TrackData, TrackImage, TrackWorkerMessage } from "@components/SidebarUpload/SidebarUpload.types"
import { Bridge } from "@utils/bridge"
import { type IAudioMetadata, parseBlob } from "music-metadata"

export const bridge = new Bridge.Key<TrackWorkerMessage>(() => {
    return new Worker(new URL(import.meta.url, import.meta.url))
})

bridge.on('check-canvas', async(message) => {
    try {
        const canvas = new OffscreenCanvas(0, 0)
        if (canvas.getContext("2d")) throw Error()

        bridge.send('canvas-checked', true)
    } catch {
        bridge.send('canvas-checked', false)
    }
})

bridge.on('parse-metadata', async(message) => {
    const data = await Promise.all(await parseMetadata(message))

    bridge.send(
        'metadata-parsed',
        data.filter(Boolean) as TrackData[]
    )
})

const imageSize = 152

async function resizeImage(data: Uint8Array, format: string): Promise<TrackImage> {
    const blob = new Blob([data], { type: format })
    const imageBitmap = await createImageBitmap(blob)

    const canvas = new OffscreenCanvas(imageSize, imageSize)
    const ctx = canvas.getContext("2d")!
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    ctx.drawImage(
        imageBitmap,
        0, 0,
        imageSize, imageSize
    )

    const finalImageData = ctx.getImageData(0, 0, imageSize, imageSize).data as unknown as Uint8Array
    const finalImageBlob = await canvas.convertToBlob()

    return {
        data: finalImageData,
        objectURL: URL.createObjectURL(finalImageBlob)
    }
}

export async function parseMetadata(files: File[]) {
    return files.map(async(file) => {
        let metadata: IAudioMetadata

        try {
            metadata = await parseBlob(file)
        } catch {
            return null
        }

        const image = metadata.common.picture?.at(0)
        const imageData = image?.data
        const imageFormat = image?.format

        if (
            image == null ||
            (imageData == null || imageData.length == 0) ||
            (imageFormat == null || imageFormat == '')
        ) return new TrackData(metadata)

        const resizedImage = await resizeImage(imageData, imageFormat)
        return new TrackData(metadata, resizedImage)
    })
}