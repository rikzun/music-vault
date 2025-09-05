import { TrackData } from "@components/SidebarUpload/SidebarUpload.types"
import { type IAudioMetadata, parseBlob } from "music-metadata"
import * as Comlink from "comlink"

export namespace TrackWorkerRPC {
    const imageSize = 152

    export async function checkCanvasSupport() {
        try {
            const canvas = new OffscreenCanvas(imageSize, imageSize)
            if (canvas.getContext("2d") == null) throw Error()

            return true
        } catch {
            return false
        }
    }

    export async function resizeImage(data: Uint8Array, format: string) {
        const blob = new Blob([data as BlobPart], { type: format })
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
    
        const finalImageBlob = await canvas.convertToBlob()
        const finalImageData = await finalImageBlob.arrayBuffer()
    
        return {
            data: finalImageData,
            objectURL: URL.createObjectURL(finalImageBlob)
        }
    }

    export async function parseMeta(files: File[]) {
        return (await Promise.all(files.map(async(file) => {
            let meta: IAudioMetadata
    
            try {
                meta = await parseBlob(file)
            } catch {
                return null
            }

            console.log(meta)
    
            const image = meta.common.picture?.[0]
            const imageData = image?.data
            const imageFormat = image?.format   
    
            if (
                image == null ||
                (imageData == null || imageData.length == 0) ||
                (imageFormat == null || imageFormat == '')
            ) return new TrackData(file, meta)
    
            const resizedImage = await resizeImage(imageData, imageFormat)
            return new TrackData(file, meta, resizedImage)
        }))).filter(Boolean) as TrackData[]
    }
}

Comlink.expose(TrackWorkerRPC)