import "./UserPanel.style.scss"
import HideImageRounded from "@mui/icons-material/HideImageRounded"
import SettingsRounded from "@mui/icons-material/SettingsRounded"
import FolderRounded from "@mui/icons-material/FolderRounded"
import CreateNewFolderRounded from "@mui/icons-material/CreateNewFolderRounded"
import { Volume } from "@components/common/Volume"
import { ClientAtoms } from "@atoms/client"
import { Button } from "@components/common/Button"
import { PlaylistBuffer } from "@components/common/PlaylistBuffer"
import { FS } from "@utils/fs"
import { useEffect } from "react"
import { useState } from "@utils/hooks"

export function UserPanel() {
    const client = ClientAtoms.useClient()
    const isSupportedFS = useState(FS.isSupported())
    const isStoredInFS = useState(true)

    useEffect(() => {
        if (!FS.isSupported()) return

        FS.isStored().then((v) => {
            isStoredInFS.set(v)
        })
    }, [])

    const onOpenDialog = () => {
        FS.openDialog().then((isSelected) => {
            isStoredInFS.set(isSelected)
        })
    }

    return (
        <div className="user-panel">
            <PlaylistBuffer />

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

                <div className="buttons">
                    {isSupportedFS.value &&
                        <Button.Icon
                            onClick={onOpenDialog}
                            icon={isStoredInFS.value ? FolderRounded : CreateNewFolderRounded}
                            color={isStoredInFS.value ? undefined : "#ff5d5a"}
                        />
                    }
                    
                    <Button.Icon
                        icon={SettingsRounded}
                    />
                </div>
            </div>
        </div>
    )
}