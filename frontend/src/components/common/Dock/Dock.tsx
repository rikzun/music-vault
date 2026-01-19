import "./Dock.style.scss"
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
import { mobile } from "src/App"

const isSupportedFS = FS.isSupported()

export function Dock() {
    const client = ClientAtoms.useClient()
    const isStoredInFS = useState(true)

    useEffect(() => {
        if (!isSupportedFS) return

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
        <div className="dock">
            <PlaylistBuffer />

            {!mobile && <Volume />}

            <div className="client-section">
                <div className="left">
                    {client.value?.avatarURL
                        ? <img className="avatar" src={client.value.avatarURL} />
                        : <div className="avatar avatar__empty" children={<HideImageRounded />} />
                    }

                    <div className="login">
                        {client.value?.login}
                    </div>
                </div>

                <div className="right">
                    {isSupportedFS &&
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