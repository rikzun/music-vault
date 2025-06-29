import './SidebarUpload.style.scss'
import { useRef } from 'react'
import axios from 'axios'

export function SidebarUpload() {
    const inputRef = useRef<HTMLInputElement>(null)

    const onClick = () => {
        if (!inputRef.current) return
        
        const rawFiles = inputRef.current.files
        const files = rawFiles ? Array.from(rawFiles) : []

        if (!files.length) return

        const reader = new FileReader()

        reader.onload = async (e) => {
            const encoder = new TextEncoder()

            const trackData = {
                title: 'test-track',
                author: 'test-author',
                codec: 'mp3',
                bitrate: 192,
                fileName: 'test-track'
            }
            
            const trackDataBuffer = encoder.encode(JSON.stringify(trackData)).buffer
            const trackBuffer = e.target!.result as ArrayBuffer

            axios.post('/track/upload', new Blob([trackDataBuffer, trackBuffer]), {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'X-Meta-Size': trackDataBuffer.byteLength
                }
            })
        }

        files.forEach((file) => {
            reader.readAsArrayBuffer(file)
        })
    }

    return (
        <div className="content content-upload">
            <div className="title">
                Upload
            </div>

            <input
                type="file"
                ref={inputRef}
            />
            
            <button
                className="send-button"
                onClick={onClick}
                children="Send"
            />
        </div>
    )
}