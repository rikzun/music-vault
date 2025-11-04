import { PopupMenuOptions } from "src/common/popupMenu"

export const options: PopupMenuOptions = {
    "playlists": [
        {
            label: "Create new",
            onClick: () => {
                console.log("aaaaaa")
            }
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
    "playlist": [
        {
            label: "Delete"
        }
    ]
}