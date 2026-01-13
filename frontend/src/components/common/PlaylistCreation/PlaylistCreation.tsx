import "./PlaylistCreation.style.scss"
import axios from "axios"
import { EventBus, useState } from "@utils/hooks"
import { Button } from "@components/common/Button"
import { Input } from "@components/common/Input"
import { concatArrayBuffers } from "@utils/std"

export function PlaylistCreation() {
    const title = useState("")
    const image = useState<File | null>(null)
    const imageURL = useState<string | null>(null)

    const onCreate = async () => {
        const json = JSON.stringify({ title: title.value })

        const metaBuffer = new TextEncoder()
            .encode(json).buffer
        
        const imageBuffer = await image.value
            ?.arrayBuffer()
        
        const data = imageBuffer
            ? concatArrayBuffers(metaBuffer, imageBuffer)
            : metaBuffer

        axios.post("/playlist/create", data, {
            headers: {
                "Content-Type": "application/octet-stream",
                "X-Meta-Size": metaBuffer.byteLength,
            }
        }).then(() => {
            EventBus.emit("playlistCreationCancel")
        })
    }

    return (
        <div className="playlist-creation-component">
            <div className="column">
                <div className="field">
                    <div className="title">title</div>
                    <input
                        className="value"
                        onChange={(e) => title.set(e.target.value)}
                        value={title.value}
                    />
                </div>
                <div className="btns">
                    <Button.Tiny
                        onClick={onCreate}
                        value="SAVE"
                        fullWidth
                    />

                    <Button.Tiny
                        color="var(--error-color)"
                        onClick={() => EventBus.emit("playlistCreationCancel")}
                        value="CANCEL"
                    />
                </div>
            </div>

            <div className="column">
                <Input.Image
                    imageURL={imageURL.value}
                    onChange={(file) => {
                        image.set(file)
                        imageURL.set(URL.createObjectURL(file))
                    }}
                />
            </div>
        </div>
    )
}