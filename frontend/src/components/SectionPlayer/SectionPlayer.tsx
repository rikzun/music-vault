import { MdPause, MdPlayArrow, MdRepeat, MdShuffle, MdSkipNext, MdSkipPrevious } from "react-icons/md"
import "./SectionPlayer.style.scss"
import { useState } from "@utils/hooks"
import { useEffect } from "react"
import { PlayerAtoms } from "@atoms/player"
import { VolumeAtoms } from "@atoms/volume"
import axios from "axios"

const audioContext = new AudioContext()
const audioElement = new Audio()

const gainNode = audioContext.createGain()
const track = audioContext.createMediaElementSource(audioElement)
track.connect(gainNode).connect(audioContext.destination)

export function SectionPlayer() {
    const currentTrack = PlayerAtoms.useCurrentTrack()
    const trackList = PlayerAtoms.useTracklist()
    const volume = VolumeAtoms.useVolume()
    const muted = VolumeAtoms.useMuted()

    const isPlaying = useState<boolean>(false)
    const audioBuffer = useState<AudioBufferN>(null)

    useEffect(() => {
        if (!currentTrack.value) return

        const audioURL = trackList.value.get(currentTrack.value)?.audioURL
        if (!audioURL) return

        axios.get<ArrayBuffer>(ENV.APP_URL + audioURL, { responseType: 'arraybuffer' })
            .then((res) => {
                audioElement.src = URL.createObjectURL(new Blob([res.data]))
                return audioContext.decodeAudioData(res.data)
            })
            .then((ab) => audioBuffer.set(ab))
            .catch((e) => console.log(e))
    }, [currentTrack.value])

    useEffect(() => {
        audioElement.onended = onEnded
        audioElement.onpause = onPause
        audioElement.oncanplay = onCanPlay
    }, [])

    useEffect(() => {
        gainNode.gain.value = muted.value ? 0 : volume.value * 0.01
    }, [volume.value, muted.value])

    const onPlay = () => {
        if (audioContext.state === "suspended") {
            audioContext.resume()
        }

        if (!audioElement.src) return

        if (isPlaying.value) {
            audioElement.pause()
        } else {
            audioElement.play()
        }

        isPlaying.invert()
    }

    const onEnded = () => {
        isPlaying.set(false)
    }

    const onPause = () => {
        isPlaying.set(false)
    }

    const onCanPlay = () => {
        audioElement.play()
        isPlaying.set(true)
    }

    const PlayStateButton = isPlaying.value ?  MdPause : MdPlayArrow

    return (
        <div className="section-player">
            <MdShuffle size={36} />
            <MdSkipPrevious size={50} />
            <PlayStateButton size={50} onClick={onPlay} />
            <MdSkipNext size={50} />
            <MdRepeat size={36} />
        </div>
    )
}
