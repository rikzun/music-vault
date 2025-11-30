export type EventBusData = {
    playlistCreation: void
    playlistCreationCancel: void
    playlistAddToBuffer: { id: number }
}