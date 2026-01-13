import { EventBus } from "@utils/hooks"
import { PopupMenuType } from "src/types/popupMenu"
import { getDefaultStore } from "jotai"
import { BufferAtoms } from "@atoms/buffer"

export interface PopupMenuItem {
    label: string
    onClick?: (data?: any) => void
    children?: Omit<PopupMenuItem, "children">[]
}

export type PopupMenuOptions = Record<PopupMenuType, PopupMenuItem[]>

export const popupMenuOptions: PopupMenuOptions = {
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
                    label: "Creation date",
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
            onClick: (data: { id: number }) => {
                getDefaultStore().set(BufferAtoms.playlistID, data.id)
            }
        }
    ]
}