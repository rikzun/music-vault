import './SidebarUpload.style.scss'
import { IAudioMetadata, IPicture, parseBlob } from 'music-metadata'
import { Button } from '@components/Button'
import { preventEvent } from '@utils/std'
import { useInput, useState } from '@utils/hooks'
import { MdCloudDownload } from "react-icons/md"
import { useRef } from 'react'

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
    album: string | null
    codec: string | null
    bitrate: number | null
    lossless: boolean
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
let dropClearInterval: NodeJS.Timeout

export function SidebarUpload() {
    const dndRef = useRef<HTMLDivElement>(null)
    const tracks = useState<TrackData[]>([])

    const fileHandler = async (files: File[]) => {
        if (!files.length) return

        const fileData = (await Promise.allSettled(files.map((v) => parseBlob(v))))
            .filter((v): v is PromiseFulfilledResult<IAudioMetadata> => v.status === 'fulfilled')
            .map((v) => v.value)

        if (!fileData.length) {
            document
                .getElementById(iconID)!
                .animate(keyFrames, { duration: 500 })

            return
        }

        const data = fileData.map((data, index) => {
            console.log(data)
            
            return {
                image: handleImage(data.common.picture),
                title: data.common.title ?? null,
                artists: data.common.artists ?? [],
                album: data.common.album ?? null,
                codec: data.format.codec ?? null,
                bitrate: data.format.bitrate ?? null,
                fileName: files[index].name,
                lossless: data.format.lossless ?? false
            } as TrackData
        })

        tracks.set(data)
    }

    const input = useInput(fileHandler)

    return (
        <div className="section-content section-content__upload">
            <div className="title">
                Upload
            </div>

            <div className="content">
                {!tracks.value.length && (
                    <div
                        className="dnd-container"
                        aria-label="file upload zone"
                        ref={dndRef}
                        onDragOver={(e) => {
                            preventEvent(e)
                            clearTimeout(dropClearInterval)

                            dndRef.current!.classList.add('dnd-container__active')
                            e.dataTransfer.dropEffect = 'copy'
                        }}
                        onDragLeave={(e) => {
                            preventEvent(e)
                            clearTimeout(dropClearInterval)

                            dropClearInterval = setTimeout(() => {
                                dndRef.current!.classList.remove('dnd-container__active')
                            }, 10)
                        }}
                        onDrop={(e) => {
                            preventEvent(e)
                            fileHandler(Array.from(e.dataTransfer.files))
                        }}
                    >
                        <div className="info-section">
                            <MdCloudDownload id={iconID} />
                            
                            <span>Drag & Drop</span>
                            <span>or <Button.Text value="browse" onClick={input.click} /></span>
                        </div>
                    </div>
                )}

                {tracks.value.map((v, i) => (
                    <Track key={i} data={v} />
                ))}
            </div>

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

interface TrackProps {
    data: TrackData
}

function Track(props: TrackProps) {
    return (
        <button className="track-data">
            <div className="column-field">
                <div className="column">
                    <div className="field">
                        <div className="title">title</div>
                        <div className="value">{props.data.title}</div>
                    </div>
                </div>

                <div className="column">
                    <div className="field field-image">
                        <img src={props.data.image?.objectURL} />
                    </div>
                </div>
            </div>

            <div className="field">
                <div className="title">artist</div>
                <div className="value">{props.data.artists[0]}</div>
            </div>

            {props.data.artists.map((artist, index) => {
                if (index == 0) return null
                
                return (
                    <div className="field" key={artist + index}>
                        <div className="title">artist</div>
                        <div className="value">{artist}</div>
                    </div>
                )
            })}

            {props.data.album && (
                <div className="field">
                    <div className="title">album</div>
                    <div className="value">{props.data.album}</div>
                </div>
            )}

            
            <div className="column-field">
                <div className="column">
                    <div className="field">
                        <div className="title">codec</div>
                        <div className="value">{props.data.codec}</div>
                    </div>
                </div>

                <div className="column">
                    <div className="field field-bitrate">
                        <div className="title">bitrate</div>
                        <div className="value">{props.data.bitrate ? (props.data.bitrate / 1000).toFixed(1) : 0} kbit/s</div>
                    </div>
                </div>
            </div>
        </button>
    )
}