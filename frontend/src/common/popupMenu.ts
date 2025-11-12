export type PopupMenuType =
    | "playlists"

export interface PopupMenuItem {
    label: string
    onClick?: (data?: Record<string, string>) => void
    children?: PopupMenuItem[]
}

export type PopupMenuOptions = Record<PopupMenuType, PopupMenuItem[]>

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
    data?: Record<string, string>
}

export interface PopupMenuInitiator extends PopupMenuData {
    anchorH?: HorizontalPosition
    anchorV?: VerticalPosition
    transformH?: HorizontalPosition
    transformV?: VerticalPosition
}