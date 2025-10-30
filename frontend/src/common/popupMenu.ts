export type PopupMenuType =
    | "playlists"
    | "playlist"

export type HorizontalPosition =
    | "left"
    | "center"
    | "right"

export type VerticalPosition =
    | "top"
    | "center"
    | "bottom"

export interface PopupMenuData {
    type: PopupMenuType
    data?: {[key: string]: string}
}

export interface PopupMenuInitiator extends PopupMenuData {
    anchorH?: HorizontalPosition
    anchorV?: VerticalPosition
    transformH?: HorizontalPosition
    transformV?: VerticalPosition
}