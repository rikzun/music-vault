import "./UserPanel.style.scss"
import { MdSettings } from "react-icons/md"
import { Volume } from "@components/Volume"
import { ClientAtoms } from "@atoms/client"

export function UserPanel() {
    const client = ClientAtoms.useClient()

    return (
        <div className="user-panel">
            <Volume />

            <div className="main">
                <div className="info">
                    <img />

                    <div className="login">
                        {client.value?.login}
                    </div>
                </div>

                <div className="settings-button">
                    <MdSettings />
                </div>
            </div>
        </div>
    )
}