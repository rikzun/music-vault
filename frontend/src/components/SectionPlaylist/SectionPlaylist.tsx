import { useEffect } from "react"
import "./SectionPlaylist.style.scss"
import axios from "axios"
import { PlaylistAtoms } from "@atoms/playlist"
import { Track } from "src/common/types"
import { UploadedTracksResponse } from "./SectionPlaylist.types"
import { PlayerAtoms } from "@atoms/player"

export function SectionPlaylist() {
    const playlist = PlaylistAtoms.usePlaylistID()
    const currentTrack = PlayerAtoms.useCurrentTrack()
    const trackList = PlayerAtoms.useTracklist()

    useEffect(() => {
        axios.get<UploadedTracksResponse>("/track/get-uploaded").then((res) => {
            const trackMap = new Map<number, Track>()

            res.data.data.forEach((track) => {
                trackMap.set(track.id, track)
            })

            trackList.set(trackMap)
        }).catch((res) => {})
    }, [])

    return (
        <div className="section-playlist">
            {Array.from(trackList.value.values()).map((track) => (
                <button
                    key={track.id}
                    onClick={() => currentTrack.set(track.id)}
                >
                    {track.audioURL}
                </button>
            ))}
        </div>
    )
}