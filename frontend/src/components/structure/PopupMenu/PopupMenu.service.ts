import { EventBus } from "@utils/hooks"
import { PopupMenuType } from "src/types/popupMenu"
import { getDefaultStore } from "jotai"
import { BufferAtoms } from "@atoms/buffer"
import { UploadAtoms } from "@atoms/upload"

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
    ],
    "uploadTrack": [
        {
            label: "Edit",
            onClick: (data: { key: number }) => {
                EventBus.emit("uploadTrackEdit", data)
            }
        },
        {
            label: "Remove",
            onClick: (data: { key: number }) => {
                getDefaultStore().set(UploadAtoms.tracks, (state) => {
                    const index = state.findIndex((v) => v.key === data.key)
                    if (index === -1) return state

                    state.splice(index, 1)
                    return [...state]
                })
            }
        }
    ]
}