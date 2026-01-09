import "./SectionPlaylist.style.scss"
import axios from "axios"
import { useEffect } from "react"
import { Track } from "src/types/types"
import { UploadedPlaylistResponse } from "./SectionPlaylist.types"
import { PlayerAtoms } from "@atoms/player"
import { PlaylistTrack } from "@components/PlaylistTrack"
import { PlaylistAtoms } from "@atoms/playlist"
import { PlaylistInfo } from "@components/PlaylistInfo"
import { Scrollbar } from "@components/Scrollbar"

export function SectionPlaylist() {
    const currentPlaylistID = PlaylistAtoms.useCurrentPlaylistID()
    const trackList = PlayerAtoms.useTracklist()
    const currentTrack = PlayerAtoms.useCurrentTrack()

    useEffect(() => {
        trackList.set(new Map())

        const url = currentPlaylistID.value === 0
            ? "/playlist/uploaded"
            : `/playlist/${currentPlaylistID.value}/get-tracks`

        axios.get<UploadedPlaylistResponse>(url).then((res) => {
            const trackMap = new Map<number, Track>()

            res.data.data.forEach((track) => {
                trackMap.set(track.id, track)
            })

            trackList.set(trackMap)
        })
    }, [currentPlaylistID.value])

    return (
        <div className="section-playlist">
            <PlaylistInfo />

            <Scrollbar>
                <div className="tracks">
                    {Array.from(trackList.value.values()).map((track) => (
                        <PlaylistTrack
                            key={track.id}
                            data={track}
                            onClick={() => currentTrack.set(track.id)}
                        />
                    ))}
                </div>
            </Scrollbar>
        </div>
    )
}