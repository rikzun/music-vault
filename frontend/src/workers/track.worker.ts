import { TrackImage, TrackWorkerMessage } from "@components/SidebarUpload/SidebarUpload.types"
import { Bridge } from "@utils/bridge"
import { type IAudioMetadata, parseBlob } from "music-metadata"

export const bridge = new Bridge.Key<TrackWorkerMessage>(() => {
    return new Worker(new URL(import.meta.url, import.meta.url))
})

bridge.on('parse-metadata', async(message) => {
    parseMetadata(message)
})

const imageSize = 76 * 2

async function parseMetadata(files: File[]) {
    const fileData = (await Promise.allSettled(files.map((v) => parseBlob(v))))
        .filter((v): v is PromiseFulfilledResult<IAudioMetadata> => v.status === 'fulfilled')
        .map((v) => v.value)

    const images = fileData.map(async(metadata) => {
        if (metadata.common.picture?.at(0) == null) return

        const blob = new Blob(
            [metadata.common.picture!.at(0)!.data],
            { type: metadata.common.picture!.at(0)!.format }
        )

        const image = await createImageBitmap(blob)

        const canvas = new OffscreenCanvas(imageSize, imageSize)
        const ctx = canvas.getContext('2d')!
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        ctx.drawImage(image, 0, 0, imageSize, imageSize)

        const finalImageData = ctx.getImageData(0, 0, imageSize, imageSize).data as unknown as Uint8Array
        const finalImageBlob = await canvas.convertToBlob()
        const finalImageDataUrl = URL.createObjectURL(finalImageBlob)

        return { data: finalImageData, objectURL: finalImageDataUrl } as TrackImage
    })

    const a = (await Promise.all(images)).filter(Boolean) as TrackImage[]
    
    bridge.send('metadata-parsed', {
        data: fileData,
        images: a
    })
}