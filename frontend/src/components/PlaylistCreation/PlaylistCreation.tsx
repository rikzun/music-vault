import { ImageLoader } from "@components/ImageLoader"
import "./PlaylistCreation.style.scss"
import { EventBus, useState } from "@utils/hooks"
import { Button } from "@components/Button";
import { useEffect } from "react";
import axios from "axios";

export function PlaylistCreation() {
    const title = useState<string>("");

    const onCreate = () => {
        const data = JSON.stringify({
            title: title.value,
        })

        const buffer = new TextEncoder()
            .encode(data)
            .buffer as ArrayBuffer

        axios.post("/playlist/create", buffer, {
            headers: {
                "Content-Type": "application/octet-stream",
                "X-Meta-Size": buffer.byteLength,
            }
        }).then((res) => {
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
                <ImageLoader imageURL="" />
            </div>
        </div>
    )
}