import { IUploadTrackMeta, TrackImage } from "@components/sidebar/SidebarUpload"
import { type IAudioMetadata, parseBlob } from "music-metadata"
import * as Comlink from "comlink"
import { WorkerLib } from "@workers/lib"
import { trimAndNullIfEmpty } from "@utils/std"

export class TrackWorkerRPC extends WorkerLib.RPC {
    imageSize = 512

    async checkCanvasSupport() {
        try {
            const canvas = new OffscreenCanvas(this.imageSize, this.imageSize)
            if (canvas.getContext("bitmaprenderer") == null) throw Error()

            return true
        } catch {
            return false
        }
    }

    async resizeImage(data: Blob): Promise<TrackImage> {
        const imageBitmap = await createImageBitmap(data, {
            resizeWidth: this.imageSize,
            resizeHeight: this.imageSize,
            resizeQuality: "high"
        })

        const canvas = new OffscreenCanvas(this.imageSize, this.imageSize)
        const ctx = canvas.getContext("bitmaprenderer")!

        ctx.transferFromImageBitmap(imageBitmap)
        imageBitmap.close()

        const hash = await this.getPerceptualHash(canvas)
        const blob = await canvas.convertToBlob()

        return {
            pHash: hash,
            blob: blob,
            objectURL: URL.createObjectURL(blob)
        }
    }

    async getPerceptualHash(canvas: OffscreenCanvas): Promise<string> {
        const smallCanvas = new OffscreenCanvas(8, 8)
        const ctx = smallCanvas.getContext('2d')!
        
        ctx.drawImage(canvas, 0, 0, 8, 8)
        
        const data = ctx.getImageData(0, 0, 8, 8).data
        
        const grayscale = new Uint8Array(64)
        let totalBrightness = 0
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114)
            grayscale[i / 4] = gray
            totalBrightness += gray
        }
        
        const avgBrightness = totalBrightness / 64
        
        let hashStr = "";
        for (let i = 0; i < 64; i++) {
            hashStr += grayscale[i] >= avgBrightness ? "1" : "0"
        }
        
        return BigInt("0b" + hashStr)
            .toString(10)
            .padStart(20, "0")
    }

    async parseMeta(file: File) {
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

        const bitrate = meta.format.bitrate
        
        const artist = meta.common.artists
            ?.map(trimAndNullIfEmpty)
            .filter(Boolean) as string[] | null

        const data: IUploadTrackMeta = {
            image: null,
            title: trimAndNullIfEmpty(meta.common.title),
            artists: artist ?? [],
            album: trimAndNullIfEmpty(meta.common.album),
            codec: trimAndNullIfEmpty(meta.format.codec),
            bitrate: bitrate ? Math.round(bitrate) : null,
            lossless: meta.format.lossless ?? false
        }

        if (
            image == null ||
            (imageData == null || imageData.length == 0) ||
            (imageFormat == null || imageFormat == "")
        ) return data

        const imageBlob = new Blob([imageData as BlobPart], { type: imageFormat })
        const resizedImage = await this.resizeImage(imageBlob)
        data.image = resizedImage

        return data
    }
}

Comlink.expose(new TrackWorkerRPC(true))