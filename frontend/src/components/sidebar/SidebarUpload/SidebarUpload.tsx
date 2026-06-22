import "./SidebarUpload.style.scss"
import axios, { AxiosRequestConfig } from "axios"
import { Button } from "@components/common/Button"
import { useInput } from "@utils/hooks"
import CloudDownloadRounded from "@mui/icons-material/CloudDownloadRounded"
import { IUploadTrack, TrackImage, UploadData } from "./SidebarUpload.types"
import { DragAndDrop } from "@components/common/DragAndDrop"
import { UploadTrack } from "@components/common/UploadTrack"
import { Workers } from "@workers"
import { Scrollbar } from "@components/common/Scrollbar"
import { UploadTrackProgress } from "@components/common/UploadTrackProgress"
import { UploadAtoms } from "@atoms/upload"
import { AsyncPool } from "@utils/asyncPool"
import { ID } from "../../../types/types"
import { toOctetStream } from "@utils/std"

export const trackWorker = Workers.Track()
let isCanvasSupported: boolean | null = null

trackWorker.rpc.checkCanvasSupport().then((value) => {
    isCanvasSupported = value
})

let lastTrackID = 0

const asyncPool = new AsyncPool(5)

export function SidebarUpload() {
    const isUploading = UploadAtoms.useIsUploading()
    const tracks = UploadAtoms.useTracks()
    const currentEditKey = UploadAtoms.useCurrentEditKey()
    const currentTrackData = UploadAtoms.useCurrentTrackData()

    const fileHandler = async (files: File[]) => {
        if (!files.length) return

        const data = files.map((file) => {
            return {
                key: ++lastTrackID,
                progress: null,
                errorStatus: null,

                file: file,
                meta: null
            } as IUploadTrack
        })

        tracks.set((state) => {
            return [...state, ...data]
        })

        console.log(trackWorker)

        const rpc = isCanvasSupported
            ? trackWorker.rpc
            : trackWorker.default
        
        for (const track of data) {
            const meta = await rpc.parseMeta(track.file)

            tracks.set((state) => {
                const index = state.findIndex((vv) => vv.key === track.key)
                if (index === -1) return state

                if (meta == null) state.splice(index, 1)
                else state[index].meta = meta

                return [...state]
            })
        }
    }

    const onUpload = () => {
        isUploading.set(true)

        const data: Record<string, IUploadTrack[]> = {}

        tracks.value.forEach((v) => {
            const pHash = v.meta?.image?.pHash || "null"

            data[pHash] ??= []
            data[pHash].push(v)
        })

        const imageless = data["null"] ?? []
        imageless.forEach((track) => {
            sendTrack(track, null)
        })

        function sendTrack(track: IUploadTrack, imageID: number | null) {
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

                const meta = toOctetStream(metaJSON)
                const blob = toOctetStream(meta, e.target!.result!)

                const index = tracks.value.findIndex((v) => v.key === track.key)

                tracks.set((state) => {
                    state[index].progress = 0
                    return [...state]
                })

                const headers: AxiosRequestConfig["headers"] = {
                    "Content-Type": "application/octet-stream",
                    "X-Meta-Size": meta.size
                }

                if (imageID) {
                    headers["X-Image-ID"] = imageID
                }

                asyncPool.add(() => {
                    return axios.post("/tracks/upload", blob, {
                        headers: headers,

                        onUploadProgress: (e) => {
                            const progress = Math.round((e.progress ?? 0) * 100)
    
                            tracks.set((state) => {
                                state[index].progress = progress
                                return [...state]
                            })
                        }
                    }).catch(() => {
                        tracks.set((state) => {
                            state[index].errorStatus = "unknown_error"
                            return [...state]
                        })
                    })
                })
            }

            reader.readAsArrayBuffer(track.file)
        }

        delete data["null"]
        Object.keys(data).forEach(async(pHash) => {
            const tracks = data[pHash]
            const image = tracks[0].meta!.image!

            const res = await axios
                .get<ID>("/tracks/covers/match", { params: { pHash } })
                .catch(async(err) => {
                    if (axios.isAxiosError(err) && err.status == 404) {
                        const res = await axios.post<ID>("/tracks/covers/upload", image.blob, {
                            headers: {
                                "Content-Type": "application/octet-stream",
                            },
                            params: { pHash }
                        })

                        return { data: res.data }
                    }

                    return null
                })

            const imageID = res?.data.id
            if (!imageID) return

            tracks.forEach((track) => {
                sendTrack(track, imageID)
            })
        })
    }

    const onCancel = () => {
        isUploading.set(false)

        tracks.set((state) => {
            state.forEach((track) => {
                const objectURL = track.meta?.image?.objectURL
                if (objectURL) URL.revokeObjectURL(objectURL)
            })

            return []
        })

        currentEditKey.set(null)
        currentTrackData.set(null)
    }

    const fileInput = useInput({ handler: fileHandler, multiple: true })
    const folderInput = useInput({ handler: fileHandler, webkitdirectory: true })

    const totalTracks = tracks.value.length

    const processedTracks = tracks.value.filter((v) => v.meta != null).length
    const missingInfoTracks = tracks.value.filter((v) => v.meta && (!v.meta!.title || v.meta!.artists.length === 0)).length

    const uploadedTracks = tracks.value.filter((v) => v.progress === 100).length
    const failedTracks = tracks.value.filter((v) => v.progress != null && v.errorStatus != null).length

    const showUploadButton = totalTracks !== 0 && !isUploading.value
    const disableDoneButton = !isUploading.value && uploadedTracks + failedTracks !== totalTracks

    return (
        <div className="section-content section-content__upload">
            <div className="top">
                <div className="left">
                    Upload
                </div>

                {totalTracks !== 0 &&
                    <div className="right">
                        {!isUploading.value && <>
                            <span className="green" children={processedTracks} /><span children=" / " />
                            <span children={totalTracks} /><span children=" | " />
                            <span className="yellow" children={missingInfoTracks} />
                        </>}

                        {isUploading.value && <>
                            <span className="green" children={uploadedTracks} /><span children=" / " />
                            <span>{totalTracks}</span><span children=" | " />
                            <span className="red" children={failedTracks} />
                        </>}
                    </div>
                }
            </div>

            <Scrollbar>
                <div className="content">
                    {isUploading.value && tracks.value.map((track) => {
                        if (track.meta == null) return null

                        return (
                            <UploadTrackProgress
                                key={track.key}
                                data={track}
                            />
                        )
                    })}

                    {!isUploading.value && (
                        <DragAndDrop
                            aria-label="file upload zone"
                            className={totalTracks !== 0 ? "dnd-component__active" : undefined}
                            onChange={fileHandler}
                            disabled={isUploading.value}
                        >
                            {totalTracks === 0 && (
                                <div className="info-section">
                                    <CloudDownloadRounded />

                                    <span>Drag & Drop</span>
                                    <span>or <Button.Text value="browse files"  onClick={fileInput.click}   /></span>
                                    <span>or <Button.Text value="browse folder" onClick={folderInput.click} /></span>
                                </div>
                            )}

                            {tracks.value.map((track) => {
                                if (track.meta == null) return null

                                return (
                                    <UploadTrack
                                        key={track.key}
                                        data={track}
                                    />
                                )
                            })}
                        </DragAndDrop>
                    )}
                </div>
            </Scrollbar>

            {showUploadButton && (
                <div className="bottom">
                    <Button.Small
                        value="Upload"
                        onClick={onUpload}
                        disabled={currentEditKey.value !== null}
                        fullWidth
                    />

                    <Button.Small
                        value="Cancel"
                        onClick={onCancel}
                        color="var(--error-color)"
                    />
                </div>
            )}

            {isUploading.value && (
                <div className="bottom">
                    <Button.Small
                        value="Done"
                        onClick={onCancel}
                        disabled={disableDoneButton}
                        fullWidth
                    />
                </div>
            )}
        </div>
    )
}