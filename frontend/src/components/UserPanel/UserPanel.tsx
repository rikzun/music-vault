import "./UserPanel.style.scss"
import HideImageRounded from "@mui/icons-material/HideImageRounded"
import SettingsRounded from "@mui/icons-material/SettingsRounded"
import ClearRounded from "@mui/icons-material/ClearRounded"
import { Volume } from "@components/Volume"
import { ClientAtoms } from "@atoms/client"
import { Button } from "@components/Button"
import { EventBus } from "@utils/hooks"
import { BufferAtoms } from "@atoms/buffer"

export function UserPanel() {
    const client = ClientAtoms.useClient()
    const bufferedPlaylist = BufferAtoms.usePlaylistID()

    EventBus.useListener("playlistAddToBuffer", (data) => {
        bufferedPlaylist.set(data.id)
    })

    return (
        <div className="user-panel">
            {bufferedPlaylist.value !== null && <div className="buffer">
                TEST
                <Button.Icon onClick={() => bufferedPlaylist.set(null)} icon={ClearRounded} />
                <div className="background" />
            </div>}

            <Volume />

            <div className="main">
                <div className="info">
                    {client.value?.avatarURL
                        ? <img className="avatar" src={client.value.avatarURL} />
                        : <div className="avatar avatar__empty" children={<HideImageRounded />} />
                    }

                    <div className="login">
                        {client.value?.login}
                    </div>
                </div>

                <div className="settings-button">
                    <Button.Icon
                        onClick={console.log}
                        icon={SettingsRounded}
                    />
                </div>
            </div>
        </div>
    )
}