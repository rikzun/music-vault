import { MdHideImage, MdPause, MdPlayArrow, MdRepeat, MdShuffle, MdSkipNext, MdSkipPrevious } from "react-icons/md"
import "./SectionPlayer.style.scss"
import { useState } from "@utils/hooks"
import { useEffect, useRef } from "react"
import { PlayerAtoms } from "@atoms/player"
import { VolumeAtoms } from "@atoms/volume"
import { TrackWaveform } from "@components/TrackWaveform"
import { Track } from "src/common/types"
import axios from "axios"

const audioContext = new AudioContext()
const audioElement = new Audio()

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
    }, [])

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
        const target = event.target as HTMLAudioElement
        if (!target.paused) return

        onPlayClick()
    }

    const onTimeChange = (time: number) => {
        onPlayClick()
        audioElement.currentTime = time
        onPlayClick()
    }

    const PlayStateButton = isPlaying.value ?  MdPause : MdPlayArrow

    return (
        <div className="section-player">
            <div className="track-data">
                {currentTrackData.value?.imageURL
                    ? <img className="cover" src={ENV.APP_URL + currentTrackData.value.imageURL} />
                    : <div className="cover cover__empty" children={<MdHideImage />} />
                }

                <div>{currentTrackData.value?.title ?? "No track"}</div>
                <div>{currentTrackData.value?.artists.map((artist) => artist.name).join(", ")}</div>
                <div>{currentTime.value}</div>
            </div>

            <TrackWaveform
                samples={waveformData.value}
                currentTime={currentTime.value}
                duration={currentTrackData.value?.duration || null}
                onTimeChange={onTimeChange}
            />

            <div className="control-btns">
                <MdShuffle size={36} />
                <MdSkipPrevious size={50} />
                <PlayStateButton size={50} onPointerDown={(e) => e.button == 0 && onPlayClick()} />
                <MdSkipNext size={50} />
                <MdRepeat size={36} />
            </div>
        </div>
    )
}
