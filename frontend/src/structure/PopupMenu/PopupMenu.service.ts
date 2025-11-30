import { EventBus } from "@utils/hooks"
import { PopupMenuOptions } from "src/types/popupMenu"

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
    ],
    "addPlaylistToBuffer": [
        {
            label: "Add to buffer",
            // TODO we need to do something about this (haha)
            onClick: (data) => data ? EventBus.emit("playlistAddToBuffer", { id: Number(data.id) }) : null
        }
    ]
}