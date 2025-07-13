import type { TrackData } from "@components/SidebarUpload/SidebarUpload.types"
import type { StateDispatcher } from "@utils/hooks"

export interface UploadTrackProps {
    data: TrackData
    dispatcher: StateDispatcher<TrackData[]>
}