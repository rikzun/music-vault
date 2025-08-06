import { MdPlayArrow } from 'react-icons/md'
import './PlayerSection.style.scss'
import { useState } from '@utils/hooks'
import { useEffect } from 'react'

const sampleAudioUrl = ENV.BACKEND_URL + "/uploads/track_5799fe7d-ac8c-4cd1-b75b-7a48f9c6f866"
const audioContext = new AudioContext()
const audioElement = new Audio(sampleAudioUrl)

export function PlayerSection() {
    const isPlaying = useState<boolean>(false)

    useEffect(() => {
        const track = audioContext.createMediaElementSource(audioElement)

        const gainNode = audioContext.createGain()
        track.connect(gainNode).connect(audioContext.destination)
        gainNode.gain.value = 0.1

        //audioElement.onclick = onPlay
        audioElement.onended = onEnded

        if (audioContext.state === "suspended") {
            audioContext.resume()
        }
    }, [])

    const onPlay = () => {
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
            <MdPlayArrow onClick={onPlay} size={50} />
        </div>
    )
}

// const audioPlay = async url => {
//   const context = new AudioContext();
//   const source = context.createBufferSource();
//   const audioBuffer = await fetch(url)
//     .then(res => res.arrayBuffer())
//     .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));

//   source.buffer = audioBuffer;
//   source.connect(context.destination);
//   source.start();
// };