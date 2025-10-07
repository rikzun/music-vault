import { TrackData, TrackImage } from "@components/SidebarUpload/SidebarUpload.types"
import { type IAudioMetadata, parseBlob } from "music-metadata"
import * as Comlink from "comlink"
import { WorkerLib } from "@workers/lib"

export class TrackWorkerRPC extends WorkerLib.RPC {
    imageSize = 1024

    async checkCanvasSupport() {
        try {
            const canvas = new OffscreenCanvas(this.imageSize, this.imageSize)
            if (canvas.getContext("2d") == null) throw Error()

            return true
        } catch {
            return false
        }
    }

    async resizeImage(data: Uint8Array, format: string): Promise<TrackImage> {
        const blob = new Blob([data as BlobPart], { type: format })
        const imageBitmap = await createImageBitmap(blob)

        if (imageBitmap.height <= this.imageSize && imageBitmap.width <= this.imageSize) {
            return {
                data: await blob.arrayBuffer(),
                objectURL: URL.createObjectURL(blob)
            }
        }
    
        const canvas = new OffscreenCanvas(this.imageSize, this.imageSize)
        const ctx = canvas.getContext("2d")!
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
    
        ctx.drawImage(
            imageBitmap,
            0, 0,
            this.imageSize, this.imageSize
        )
    
        const finalImageBlob = await canvas.convertToBlob()
        const finalImageData = await finalImageBlob.arrayBuffer()
    
        return {
            data: finalImageData,
            objectURL: URL.createObjectURL(finalImageBlob)
        }
    }

    async parseMeta(files: File[]) {
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
                (imageFormat == null || imageFormat == "")
            ) return new TrackData(file, meta)
    
            const resizedImage = await this.resizeImage(imageData, imageFormat)
            return new TrackData(file, meta, resizedImage)
        }))).filter(Boolean) as TrackData[]
    }
}

Comlink.expose(new TrackWorkerRPC(true))