import "./SectionPlaylist.style.scss"
import axios from "axios"
import { useEffect } from "react"
import { Track } from "src/types/types"
import { UploadedPlaylistResponse } from "./SectionPlaylist.types"
import { PlayerAtoms } from "@atoms/player"
import { PlaylistTrack } from "@components/PlaylistTrack"
import { PlaylistAtoms } from "@atoms/playlist"

export function SectionPlaylist() {
    const currentTrack = PlayerAtoms.useCurrentTrack()
    const trackList = PlayerAtoms.useTracklist()
    const currentPlaylist = PlaylistAtoms.useCurrentPlaylistID()

    useEffect(() => {
        const url = currentPlaylist.value === 0 ? "/playlist/uploaded" : `/playlist/${currentPlaylist.value}/get-tracks`

        axios.get<UploadedPlaylistResponse>(url).then((res) => {
            const trackMap = new Map<number, Track>()

            res.data.data.forEach((track) => {
                trackMap.set(track.id, track)
            })

            trackList.set(trackMap)
        })
    }, [currentPlaylist.value])

    return (
        <div className="section-playlist">
            <div className="container">
                {Array.from(trackList.value.values()).map((track) => (
                    <PlaylistTrack
                        key={track.id}
                        data={track}
                        onClick={() => currentTrack.set(track.id)}
                    />
                ))}
            </div>
        </div>
    )
}