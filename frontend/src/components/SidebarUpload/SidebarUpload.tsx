import './SidebarUpload.style.scss'
import { Button } from '@components/Button'
import { useInput, useState } from '@utils/hooks'
import { MdCloudDownload } from "react-icons/md"
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { TrackData } from '@components/SidebarUpload/SidebarUpload.types'
import { DragAndDrop } from '@components/DragAndDrop'
import { UploadTrack } from '@components/UploadTrack'
import { useEffect } from 'react'
import { bridge, parseMetadata } from '@workers/track.worker'
import { Bridge } from '@utils/bridge'

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

const workerSupported = Bridge.isWorkerSupported()
let canvasSupported: boolean | null = workerSupported ? null : false
if (workerSupported) bridge.send('check-canvas', null)

const iconID = "cloud-download-icon"
const keyFrames = [
    { fill: "var(--error-color)" },
    { transform: "translateX(0)" },
    { transform: "translateX(-5px)" },
    { transform: "translateX(5px)" },
    { transform: "translateX(-5px)" },
    { transform: "translateX(5px)" },
    { transform: "translateX(0)" }
]

export function SidebarUpload() {
    const tracks = useState<TrackData[]>([])

    const fileHandler = async (files: File[]) => {
        if (!files.length) return

        if (workerSupported) {
            bridge.send('parse-metadata', files)
        } else {
            const data = await Promise.all(await parseMetadata(files))
            handleMetadata(data.filter(Boolean) as TrackData[])
        }
    }

    const handleMetadata = (metadata: TrackData[]) => {
        if (!metadata) {
            document
                .getElementById(iconID)!
                .animate(keyFrames, { duration: 500 })

            return
        }

        tracks.set((v) => {
            const data = metadata.map((data) => {
                return Object.setPrototypeOf(data, TrackData.prototype)
            })
            
            return [...v, ...data]
        })
    }

    useEffect(() => {
        if (!workerSupported) return

        bridge.on('canvas-checked', (message) => {
            canvasSupported = message
        })

        bridge.on('metadata-parsed', (message) => {
            handleMetadata(message)
        })
    }, [])

    const input = useInput({
        handler: fileHandler,
        multiple: true
    })

    return (
        <div className="section-content section-content__upload">
            <div className="title">
                Upload
            </div>

            <OverlayScrollbarsComponent
                className="content"
                options={{scrollbars: {autoHide: 'leave', autoHideDelay: 0}}}
                defer
            >
                <DragAndDrop
                    aria-label="file upload zone"
                    className={tracks.value.length ? 'dnd-component__active' : undefined}
                    onChange={fileHandler}
                >
                    {!tracks.value.length && (
                        <div className="info-section">
                            <MdCloudDownload id={iconID} />
                            
                            <span>Drag & Drop</span>
                            <span>or <Button.Text value="browse" onClick={input.click} /></span>
                        </div>
                    )}

                    {tracks.value.map((track) => (
                        <UploadTrack
                            key={track.key()}
                            data={track}
                            dispatcher={tracks.set}
                        />
                    ))}
                </DragAndDrop>
            </OverlayScrollbarsComponent>

            {!!tracks.value.length && (
                <Button.Small
                    value="Upload"
                    onClick={console.log}
                    fullWidth
                />
            )}
        </div>
    )
}