import "./SidebarUpload.style.scss"
import { Button } from "@components/common/Button"
import { useInput, useState } from "@utils/hooks"
import CloudDownloadRounded from "@mui/icons-material/CloudDownloadRounded"
import { IUploadTrack } from "./SidebarUpload.types"
import { DragAndDrop } from "@components/common/DragAndDrop"
import { UploadTrack } from "@components/common/UploadTrack"
import { Workers } from "@workers"
import axios from "axios"
import { Scrollbar } from "@components/common/Scrollbar"
import { UploadTrackProgress } from "@components/common/UploadTrackProgress"
import { useMemo } from "react"
import { UploadAtoms } from "@atoms/upload"

const trackWorker = Workers.Track()
let isCanvasSupported: boolean | null = null

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

let lastTrackID = 0

export function SidebarUpload() {
    const isUploading = useState<boolean>(false)
    const tracks = UploadAtoms.useSidebarMenu()

    const fileHandler = async (files: File[]) => {
        if (!files.length) return

        const data = files.map((file) => {
            return {
                key: ++lastTrackID,
                notAnAudio: false,
                progress: 0,

                file: file,
                meta: null
            } as IUploadTrack
        })

        tracks.set((state) => {
            return [...state, ...data]
        })

        console.log(trackWorker)

        if (isCanvasSupported == null) {
            isCanvasSupported = await trackWorker.rpc.checkCanvasSupport()
        }

        const rpc = isCanvasSupported
            ? trackWorker.rpc
            : trackWorker.default

        data.forEach(async(v) => {
            const meta = await rpc.parseMeta(v.file)

            tracks.set((state) => {
                const index = state.findIndex((vv) => vv.key === v.key)
                if (index === -1) return state

                if (meta == null) state[index].notAnAudio = true //TODO
                else state[index].meta = meta

                return [...state]
            })
        })
    }

    const onUpload = () => {
        isUploading.set(true)

        tracks.value.forEach((track, index) => {
            const reader = new FileReader()

            reader.onload = async(e) => {
                const metaJSON = JSON.stringify({
                    title: track.meta!.title,
                    artists: track.meta!.artists,
                    album: track.meta!.album,
                    codec: track.meta!.codec,
                    bitrate: track.meta!.bitrate,
                    lossless: track.meta!.lossless
                })

                const meta = new Blob([metaJSON], {
                    type: "application/octet-stream"
                })

                const image = track.meta!.image?.blob || null

                const data = [meta, image, e.target!.result]
                    .filter(Boolean) as BlobPart[]

                const blob = new Blob(data, {
                    type: "application/octet-stream"
                })

                axios.post("/track/upload", blob, {
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "X-Meta-Size": meta.size,
                        "X-Image-Size": image?.size ?? 0
                    },
                    onUploadProgress: (e) => {
                        const progress = Math.round((e.progress ?? 0) * 100)

                        tracks.set((v) => {
                            v[index].progress = progress
                            return [...v]
                        })
                    }
                }).catch((res) => {
                    // tracks.set((v) => {
                    //     v[index].status = "unknown_error"
                    //     return [...v]
                    // })
                })
            }

            reader.readAsArrayBuffer(track.file)
        })
    }

    const fileInput = useInput({ handler: fileHandler, multiple: true })
    const folderInput = useInput({ handler: fileHandler, webkitdirectory: true })

    const stats = useMemo(() => {
        const totalTracks = tracks.value.filter((v) => !v.notAnAudio)
        const processedTracks = totalTracks.filter((v) => v.meta != null)

        const missingInfo = processedTracks.filter((v) => {
            return !v.meta!.title
                || v.meta!.artists.length === 0
        })

        return {
            totalTracks: totalTracks.length,
            processedTracks: processedTracks.length,
            missingInfo: missingInfo.length,
            isTracksEmpty: totalTracks.length === 0
        }
    }, [tracks.value])

    const uploadedCount = tracks.value
        .filter((v) => !v.notAnAudio)
        .filter((v) => v.meta != null)
        .filter((v) => v.progress === 100)
        .length

    const showUploadButton = !stats.isTracksEmpty && !isUploading.value

    return (
        <div className="section-content section-content__upload">
            <div className="top">
                <div className="left">
                    Upload
                </div>

                {!stats.isTracksEmpty &&
                    <div className="right">
                        {isUploading.value
                            ? `${uploadedCount} / ${stats.totalTracks} | 0`
                            : `${stats.processedTracks} / ${stats.totalTracks} | ${stats.missingInfo}`
                        }
                    </div>
                }
            </div>

            <Scrollbar>
                <div className="content">
                    <DragAndDrop
                        aria-label="file upload zone"
                        className={!stats.isTracksEmpty ? "dnd-component__active" : undefined}
                        onChange={fileHandler}
                    >
                        {stats.isTracksEmpty && (
                            <div className="info-section">
                                <CloudDownloadRounded id={iconID} />

                                <span>Drag & Drop</span>
                                <span>or <Button.Text value="browse files"  onClick={fileInput.click}   /></span>
                                <span>or <Button.Text value="browse folder" onClick={folderInput.click} /></span>
                            </div>
                        )}

                        {tracks.value.map((track) => {
                            if (track.notAnAudio || track.meta == null) return null

                            const Component = track.progress == 0
                                ? UploadTrack
                                : UploadTrackProgress

                            return (
                                <Component
                                    key={track.key}
                                    data={track}
                                />
                            )
                        })}
                    </DragAndDrop>
                </div>
            </Scrollbar>

            {showUploadButton && (
                <div className="bottom">
                    <Button.Small
                        value="Upload"
                        onClick={onUpload}
                        fullWidth
                    />
                </div>
            )}
        </div>
    )
}