import './UserPanel.style.scss'
import VolumeIcon from "@assets/Volume.svg"
import SettingsIcon from "@assets/Settings.svg"
import PeopleAltUrl from "@assets/PeopleAlt.svg?url"
import { KeyboardEvent } from 'react'
import { useState } from '@utils/hooks'

export function UserPanel() {
    const volume = useState(50)

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") return
        if (e.key == "Backspace") return
        if (e.key == ".") return
        if (e.key == "ArrowLeft") return
        if (e.key == "ArrowRight") return
        if (e.key == "a" && e.ctrlKey) return
        if (e.key == "x" && e.ctrlKey) return

        const target = e.target as HTMLInputElement
        const value = target.value
        if (value.length == 3 && (target.selectionStart == target.selectionEnd)) {
            e.preventDefault()
            return
        }

        if (/^\d+$/.test(e.key)) return
        e.preventDefault()
    }

    const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key != "Enter") return

        const target = e.target as HTMLInputElement
        const value = target.value
        let number = Number(value)

        if (Number.isNaN(number) || value == '') {
            target.value = volume.value.toString()
            target.blur()
            return
        }

        if (value.startsWith('0')) {
            target.value = number.toString()
        }

        if (number > 300) {
            number = 300
            target.value = '300'
        }

        volume.set(number)
        target.blur()
    }

    return (
        <div className="user-panel">
            {/* <div className="room"></div> */}

            <div className="volume">
                <VolumeIcon />

                <div className="placeholder" />

                <input
                    type="text"
                    defaultValue={volume.value}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                />
            </div>

            <div className="main">
                <div className="info">
                    <img src={PeopleAltUrl} />

                    <div className="login">
                        user_login
                    </div>
                </div>

                <div className="settings-button">
                    <SettingsIcon />
                </div>
            </div>
        </div>
    )
}