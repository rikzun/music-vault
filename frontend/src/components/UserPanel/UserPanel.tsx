import "./UserPanel.style.scss"
import { MdSettings } from "react-icons/md"
import { Volume } from "@components/Volume"

export function UserPanel() {
    return (
        <div className="user-panel">
            <Volume />

            <div className="main">
                <div className="info">
                    <img />

                    <div className="login">
                        user_login
                    </div>
                </div>

                <div className="settings-button">
                    <MdSettings />
                </div>
            </div>
        </div>
    )
}