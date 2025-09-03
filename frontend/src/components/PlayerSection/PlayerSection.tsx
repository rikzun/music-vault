import { MdPlayArrow, MdRepeat, MdShuffle, MdSkipNext, MdSkipPrevious } from 'react-icons/md'
import './PlayerSection.style.scss'
import { useState } from '@utils/hooks'
import { useEffect } from 'react'

const sampleAudioUrl = ENV.BACKEND_URL + "/uploads/track_0342c794-ca30-44a4-874f-58e45338fcb8"
const audioContext = new AudioContext()
const audioElement = new Audio(sampleAudioUrl)
audioElement.crossOrigin = "anonymous"

export function PlayerSection() {
    const isPlaying = useState<boolean>(false)

    useEffect(() => {
        const track = audioContext.createMediaElementSource(audioElement)

        const gainNode = audioContext.createGain()
        track.connect(gainNode).connect(audioContext.destination)
        gainNode.gain.value = 0.3

        audioElement.onended = onEnded
    }, [])

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
