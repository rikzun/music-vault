import "./SidebarUpload.style.scss"
import { Button } from "@components/Button"
import { useInput, useState } from "@utils/hooks"
import { MdCloudDownload } from "react-icons/md"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"
import { TrackData } from "@components/SidebarUpload/SidebarUpload.types"
import { DragAndDrop } from "@components/DragAndDrop"
import { UploadTrack } from "@components/UploadTrack"
import { Workers } from "@workers"
import axios from "axios"

const trackWorker = Workers.Track()

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

function concatArrayBuffers(...buffers: ArrayBufferLike[]): ArrayBuffer {
    const totalLength = buffers.reduce((acc, buf) => acc + buf.byteLength, 0)
    const temp = new Uint8Array(totalLength)
    let offset = 0
  
    for (const buf of buffers) {
      temp.set(new Uint8Array(buf), offset)
      offset += buf.byteLength
    }
  
    return temp.buffer
  }

export function SidebarUpload() {
    const tracks = useState<TrackData[]>([])

    const fileHandler = async (files: File[]) => {
        if (!files.length) return

        const isCanvasSupported = await trackWorker.rpc.checkCanvasSupport()
        const rpc = isCanvasSupported ? trackWorker.rpc : trackWorker.default
        const meta = await rpc.parseMeta(files)

        if (!meta.length) {
            document
                .getElementById(iconID)!
                .animate(keyFrames, { duration: 500 })

            return
        }

        tracks.set((v) => {
            const data = meta.map((data) => {
                return Object.setPrototypeOf(data, TrackData.prototype)
            })

            return [...v, ...data]
        })
    }

    const onUpload = () => {
        tracks.value.forEach((track) => {
            const reader = new FileReader()

            reader.onload = async(e) => {
                const metaBuffer = track.extractMetadata()
                const imageBuffer = track.extractImage()
                const trackBuffer = e.target!.result as ArrayBuffer

                const data = concatArrayBuffers(metaBuffer, imageBuffer, trackBuffer)
                axios.post("/track/upload", data, {
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "X-Meta-Size": metaBuffer.byteLength,
                        "X-Image-Size": imageBuffer.byteLength
                    }
                })
            }

            reader.readAsArrayBuffer(track.file)
        })
    }

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
                options={{scrollbars: {autoHide: "leave", autoHideDelay: 0}}}
                defer
            >
                <DragAndDrop
                    aria-label="file upload zone"
                    className={tracks.value.length ? "dnd-component__active" : undefined}
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
                    onClick={onUpload}
                    fullWidth
                />
            )}
        </div>
    )
}