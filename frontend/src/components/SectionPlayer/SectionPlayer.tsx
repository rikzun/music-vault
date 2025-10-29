import "./SectionPlayer.style.scss"
import { useState } from "@utils/hooks"
import { useEffect, useRef } from "react"
import { PlayerAtoms } from "@atoms/player"
import { VolumeAtoms } from "@atoms/volume"
import { TrackWaveform } from "@components/TrackWaveform"
import { Track } from "src/common/types"
import axios from "axios"
import HideImageRounded from "@mui/icons-material/HideImageRounded"
import ShuffleRounded from "@mui/icons-material/ShuffleRounded"
import SkipPreviousRounded from "@mui/icons-material/SkipPreviousRounded"
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded"
import PauseRounded from "@mui/icons-material/PauseRounded"
import SkipNextRounded from "@mui/icons-material/SkipNextRounded"
import RepeatRounded from "@mui/icons-material/RepeatRounded"
import { TrackImage } from "@components/TrackImage"

const audioContext = new AudioContext()
const audioElement = new Audio()
;(window as any).kekw = audioElement

const gainNode = audioContext.createGain()
const track = audioContext.createMediaElementSource(audioElement)
track.connect(gainNode).connect(audioContext.destination)
audioElement.crossOrigin = "anonymous"

const setTrackMetadata = "mediaSession" in navigator
    ? (track: Track) => {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: track.artists.map((v) => v.name).join(", "),
            album: track.album || undefined,
            artwork: [ { src: ENV.APP_URL + track.imageURL } ]
        })
    }
    : () => {}

export function SectionPlayer() {
    const currentTrack = PlayerAtoms.useCurrentTrack()
    const currentTrackCache = useRef<number>(null)
    const trackList = PlayerAtoms.useTracklist()
    const volume = VolumeAtoms.useVolume()
    const muted = VolumeAtoms.useMuted()
    
    const currentTrackData = useState<TrackN>(null)
    const isPlaying = useState<boolean>(false)
    const currentTime = useState<numberN>(null)
    const currentTimeTimer = useRef<NodeJS.Timeout>(null)
    const waveformData = useState<number[]>([])

    useEffect(() => {
        if (!currentTrack.value) return
        
        const trackData = trackList.value.get(currentTrack.value)
        const audioURL = trackData?.audioURL
        if (!audioURL) return

        currentTrackData.set(trackData)
        setTrackMetadata(trackData)

        axios.get<{ data: number[] }>(`track/${trackData.id}/waveform`)
            .then((res) => waveformData.set(res.data.data))

        audioElement.src = ENV.APP_URL + audioURL
    }, [currentTrack.value])

    useEffect(() => {
        audioElement.onended = onEnded
        audioElement.onpause = onPause
        audioElement.oncanplay = onCanPlay
        audioElement.onplay = onPlay
    }, [currentTrack.value])

    useEffect(() => {
        gainNode.gain.value = muted.value ? 0 : volume.value * 0.01
    }, [volume.value, muted.value])

    const startTimer = () => {
        clearInterval(currentTimeTimer.current ?? undefined)

        const id = setInterval(() => {
            currentTime.set(audioElement.currentTime)
        }, 100)

        currentTimeTimer.current = id
    }

    const stopTimer = () => {
        clearInterval(currentTimeTimer.current ?? undefined)
        currentTimeTimer.current = null
    }

    const onPlayClick = () => {
        if (audioContext.state === "suspended") {
            audioContext.resume()
        }

        if (!audioElement.src) return

        if (isPlaying.value) {
            stopTimer()
            audioElement.pause()
        } else {
            startTimer()
            audioElement.play()
        }

        isPlaying.invert()
    }

    const onEnded = () => {
        isPlaying.set(false)
    }

    const onPause = () => {
        stopTimer()
        isPlaying.set(false)
        currentTime.set(audioElement.currentTime)
    }

    const onPlay = () => {
        isPlaying.set(true)
    }

    const onCanPlay = (event: Event) => {
        if (currentTrackCache.current && (currentTrackCache.current == currentTrack.value)) return
        currentTrackCache.current = currentTrack.value

        const target = event.target as HTMLAudioElement
        if (!target.paused) return

        onPlayClick()
    }

    const PlayStateButton = isPlaying.value ? PauseRounded : PlayArrowRounded

    return (
        <div className="section-player">
            <div className="track-data">
                <TrackImage imageURL={currentTrackData.value?.imageURL} />

                <div>{currentTrackData.value?.title ?? "No track"}</div>
                <div>{currentTrackData.value?.artists.map((artist) => artist.name).join(", ")}</div>
            </div>

            <TrackWaveform
                samples={waveformData.value}
                currentTime={currentTime.value}
                duration={currentTrackData.value?.duration || null}
                onTimeChangeStarted={() => {
                    if (isPlaying.value) {
                        stopTimer()
                        audioElement.pause()
                        isPlaying.set(false)
                    }
                }}
                onTimeChange={(time) => {
                    audioElement.currentTime = time
                    currentTime.set(audioElement.currentTime)
                }}
                onTimeChangeEnded={() => {
                    startTimer()
                    audioElement.play()
                    isPlaying.set(true)
                }}
            />

            <div className="control-btns">
                <ShuffleRounded style={{height: "36px", width: "36px"}} />
                <SkipPreviousRounded style={{height: "50px", width: "50px"}} />
                <PlayStateButton style={{height: "50px", width: "50px"}} onPointerDown={(e) => e.button == 0 && onPlayClick()} />
                <SkipNextRounded style={{height: "50px", width: "50px"}} />
                <RepeatRounded style={{height: "36px", width: "36px"}} />
            </div>
        </div>
    )
}