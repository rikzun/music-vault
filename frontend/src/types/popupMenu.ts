import { PrimitiveType } from "src/types/types"

export type PopupMenuType =
    | "playlists"
    | "addPlaylistToBuffer"

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
    data?: Record<string, PrimitiveType>
}

export interface PopupMenuInitiator extends PopupMenuData {
    anchorH?: HorizontalPosition
    anchorV?: VerticalPosition
    transformH?: HorizontalPosition
    transformV?: VerticalPosition
}