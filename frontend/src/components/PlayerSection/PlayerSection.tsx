import { MdPlayArrow, MdRepeat, MdShuffle, MdSkipNext, MdSkipPrevious } from "react-icons/md"
import "./PlayerSection.style.scss"
import { useState } from "@utils/hooks"
import { useEffect } from "react"
import { PlayerAtoms } from "@atoms/player"
import { VolumeAtoms } from "@atoms/volume"

const uploadsUrlPrefix = (location.hostname === "localhost" ? "https://vault.hex3.space" : location.origin) + "/"

const audioContext = new AudioContext()
const audioElement = new Audio()
audioElement.crossOrigin = "anonymous"

const gainNode = audioContext.createGain()
const track = audioContext.createMediaElementSource(audioElement)
track.connect(gainNode).connect(audioContext.destination)

export function PlayerSection() {
    const currentTrack = PlayerAtoms.useCurrentTrack()
    const trackList = PlayerAtoms.useTracklist()
    const volume = VolumeAtoms.useVolume()
    const muted = VolumeAtoms.useMuted()

    const isPlaying = useState<boolean>(false)

    useEffect(() => {
        if (!currentTrack.value) return

        audioElement.pause()
        audioElement.src = uploadsUrlPrefix + (trackList.value.get(currentTrack.value)?.audioURL ?? "")
        audioElement.play()
    }, [currentTrack.value])

    useEffect(() => {
        audioElement.onended = onEnded
    }, [])

    useEffect(() => {
        gainNode.gain.value = muted.value ? 0 : volume.value * 0.01
    }, [volume.value, muted.value])

    const onPlay = () => {
        if (audioContext.state === "suspended") {
            audioContext.resume()
        }

        if (isPlaying.value) {
            audioElement.pause()
        } else {
            audioElement.play()
        }

        isPlaying.invert()
    }

    const onEnded = () => {
        isPlaying.invert()
    }

    return (
        <div className="player-section">
            <MdShuffle size={36} />
            <MdSkipPrevious size={50} />
            <MdPlayArrow onClick={onPlay} size={50} />
            <MdSkipNext size={50} />
            <MdRepeat size={36} />
        </div>
    )
}
