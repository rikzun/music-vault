import { EventBus } from "@utils/hooks"
import { PopupMenuOptions } from "src/common/popupMenu"

export const options: PopupMenuOptions = {
    "playlists": [
        {
            label: "Create new",
            onClick: () => EventBus.emit("playlistCreation")
        },
        {
            label: "Switch type display"
        },
        {
            label: "Switch position change mode"
        },
        {
            label: "Sort by",
            children: [
                {
                    label: "Creation date"
                },
                {
                    label: "Modification date"
                },
                {
                    label: "Number of tracks"
                },
                {
                    label: "Duration"
                }
            ]
        }
    ]
}