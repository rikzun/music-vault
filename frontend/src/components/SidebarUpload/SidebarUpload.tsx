import './SidebarUpload.style.scss'
import axios from 'axios'
import { DragEvent, MouseEvent, useRef } from 'react'
import { IPicture, parseBlob } from 'music-metadata'
import CloudDownloadIcon from "@assets/CloudDownload.svg"
import { Button } from '@components/Button'
import { preventEvent } from '@utils/std'
import { useInput, useState } from '@utils/hooks'

// const reader = new FileReader()

// reader.onload = async (e) => {
//     const encoder = new TextEncoder()

//     const trackData = {
//         title: 'test-track',
//         author: 'test-author',
//         codec: 'mp3',
//         bitrate: 192,
//         fileName: 'test-track'
//     }
    
//     const trackDataBuffer = encoder.encode(JSON.stringify(trackData)).buffer
//     const trackBuffer = e.target!.result as ArrayBuffer

//     axios.post('/track/upload', new Blob([trackDataBuffer, trackBuffer]), {
//         headers: {
//             'Content-Type': 'application/octet-stream',
//             'X-Meta-Size': trackDataBuffer.byteLength
//         }
//     })
// }

// files.forEach((file) => {
//     reader.readAsArrayBuffer(file)
// })

interface TrackData {
    image: TrackImage
    title: string | null
    artists: string[]
    codec: string | null
    bitrate: string | null
    fileName: string
}

interface TrackImage {
    data: Uint8Array
    objectURL: string
}

function handleImage(value: IPicture[] | undefined): TrackImage | null {
    const first = value?.at(0)
    if (!first || !first.format) return null

    const blob = new Blob(
        [first.data], 
        { type: first.format }
    )

    return {
        data: first.data,
        objectURL: URL.createObjectURL(blob)
    }
}

export function SidebarUpload() {
    const tracks = useState<TrackData[]>([])

    const fileHandler = async (files: File[]) => {
        if (!files.length) return

        const fileData = await Promise.all(
            files.map((file) => parseBlob(file))
        )

        const data = fileData.map((data, index) => (
            {
                image: handleImage(data.common.picture),
                title: data.common.title ?? null,
                artists: data.common.artists ?? [],
                codec: data.format.codec ?? null,
                bitrate: data.format.bitrate ?? null,
                fileName: files[index].name
            } as TrackData
        ))

        tracks.set(data)
    }

    const input = useInput(fileHandler)

    return (
        <div className="content content-upload">
            <div className="title">
                Upload
            </div>

            {tracks.value.length ? (
                tracks.value.map((v, i) => (
                    <img key={i} src={v.image.objectURL} />
                ))
            ) : (
                <div
                    className="dnd-container"
                    aria-label="file upload zone"
                    onDragOver={preventEvent}
                    onDrop={(e) => {
                        preventEvent(e)
                        fileHandler(Array.from(e.dataTransfer.files))
                    }}
                >
                    <div className="info-section">
                        <CloudDownloadIcon />
                        
                        <span>Drag & Drop</span>
                        <span>or <Button.Text value="browse" onClick={input.click} /></span>
                    </div>
                </div>
            )}

            
        </div>
    )
}