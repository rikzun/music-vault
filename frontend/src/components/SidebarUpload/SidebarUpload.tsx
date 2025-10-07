import "./SidebarUpload.style.scss"
import { Button } from "@components/Button"
import { useInput, useState } from "@utils/hooks"
import { MdCloudDownload } from "react-icons/md"
import { TrackData } from "@components/SidebarUpload/SidebarUpload.types"
import { DragAndDrop } from "@components/DragAndDrop"
import { UploadTrack } from "@components/UploadTrack"
import { Workers } from "@workers"
import axios from "axios"
import { concatArrayBuffers } from "@utils/std"
import { Scrollbar } from "@components/Scrollbar"
import { UploadTrackProgress } from "@components/UploadTrackProgress"

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

export function SidebarUpload() {
    const isUploading = useState<boolean>(false)
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
        isUploading.set(true)

        tracks.value.forEach((track, index) => {
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
                    },
                    onUploadProgress: (e) => {
                        const progress = Math.round((e.progress ?? 0) * 100)

                        tracks.set((v) => {
                            v[index].progress = progress
                            return [...v]
                        })
                    }
                }).catch((res) => {
                    tracks.set((v) => {
                        v[index].status = "unknown_error"
                        return [...v]
                    })
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

            <Scrollbar>
                <div className="content">
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

                        {tracks.value.map((track) => {
                            const Component = track.progress == null
                                ? UploadTrack
                                : UploadTrackProgress

                            return (
                                <Component
                                    key={track.key()}
                                    data={track}
                                />
                            )
                        })}
                    </DragAndDrop>
                </div>
            </Scrollbar>

            {(tracks.value.length > 0 && !isUploading.value) && (
                <Button.Small
                    value="Upload"
                    onClick={onUpload}
                    fullWidth
                />
            )}
        </div>
    )
}