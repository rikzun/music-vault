export type ContextMenuType =
    | "playlists"
    | "addPlaylistToBuffer"
    | "uploadTrack"

export type HorizontalPosition =
    | "left"
    | "center"
    | "right"

export type VerticalPosition =
    | "top"
    | "center"
    | "bottom"

export interface ContextMenuPosition {
    anchorH?: HorizontalPosition
    anchorV?: VerticalPosition
    transformH?: HorizontalPosition
    transformV?: VerticalPosition
}

export interface ContextMenuItem {
    label: string
    onClick?: (data?: any) => void
    children?: Omit<ContextMenuItem, "children">[]
}

export type ContextMenuOptions = Record<ContextMenuType, ContextMenuItem[]>