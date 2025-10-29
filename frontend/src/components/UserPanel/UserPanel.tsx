import "./UserPanel.style.scss"
import HideImageRounded from "@mui/icons-material/HideImageRounded"
import SettingsRounded from "@mui/icons-material/SettingsRounded"
import { Volume } from "@components/Volume"
import { ClientAtoms } from "@atoms/client"
import { Button } from "@components/Button"

export function UserPanel() {
    const client = ClientAtoms.useClient()

    return (
        <div className="user-panel">
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