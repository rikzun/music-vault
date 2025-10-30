import "./TrackWaveform.scss"
import { useState } from "@utils/hooks"
import { useEffect, useRef } from "react"

interface TrackWaveformProps {
    samples: number[]

    currentTime: number | null
    duration: number | null

    onTimeChangeStarted: () => void
    onTimeChange: (newTime: number) => void
    onTimeChangeEnded: () => void
}

function formatTime(value: number | null, roundFn: (x: number) => number) {
    const totalSeconds = roundFn(value ?? 0)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours === 0) {
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    } else {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
}

export function TrackWaveform(props: TrackWaveformProps) {
    const handleMove = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const width = 449
    const height = 80
  
    useEffect(() => {
        if (!props.samples || !props.duration) return

        const canvas = canvasRef.current!
        const ctx = canvas.getContext("2d")!
    
        ctx.reset()
        ctx.clearRect(0, 0, width, height)
        ctx.imageSmoothingEnabled = false
        
        const trackPercent = (props.currentTime ?? 0) / props.duration
        const barWidthWithSpace = 3
        const barWidth = 2
    
        props.samples.forEach((value, index) => {
            const x = (index * barWidthWithSpace)
            const y = height - 3
    
            const xPercent = x / width
            const barHeight = Math.floor(Math.abs(value) * (y / 100))
            const barProgress = Math.max(0, Math.min(1, (trackPercent - xPercent) / (barWidth / width)))
    
            ctx.fillStyle = "white"
            ctx.beginPath()
            ctx.rect(x, y, barWidth, -barHeight)
            ctx.fill()
            ctx.closePath()

            if (barProgress > 0) {
                ctx.fillStyle = `rgba(255, 0, 0, ${barProgress})`
                ctx.beginPath()
                ctx.rect(x, y, 2, -barHeight)
                ctx.fill()
                ctx.closePath()
            }
        })
    
        ctx.beginPath()
        ctx.fillStyle = "#CCCCCC"
        ctx.rect(0, height - 2, width, 2)
        ctx.fill()
        ctx.closePath()
    }, [props.samples, props.currentTime, props.duration])

    const pointerMove = (clientX: number) => {
        const rect = canvasRef.current!.getBoundingClientRect()
        const point = clientX - rect.left
        const percent = point / rect.width

        props.onTimeChange(percent * (props.duration ?? 0))
    }

    useEffect(() => {
        if (!handleMove.value) return

        const pointerMoveListener = (e: PointerEvent) => pointerMove(e.clientX)
        const touchMoveListener = (e: TouchEvent) => pointerMove(e.touches[0].clientX)
        const upListener = () => {
            handleMove.set(false)
            props.onTimeChangeEnded()
        }

        addEventListener("pointermove", pointerMoveListener)
        addEventListener("pointerup", upListener)

        addEventListener("touchmove", touchMoveListener)
        addEventListener("touchend", upListener)

        return () => {
            removeEventListener("pointermove", pointerMoveListener)
            removeEventListener("pointerup", upListener)

            removeEventListener("touchmove", touchMoveListener)
            removeEventListener("touchend", upListener)
        }
    }, [handleMove])
  
    return (
        <div className="waveform">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onPointerDown={(e) => {
                    if (e.pointerType == "mouse" && e.button != 0) return
                    pointerMove(e.clientX)

                    handleMove.set(true)
                    props.onTimeChangeStarted()
                }}
            />
            <div className="bottom">
                <span className="time">{formatTime(props.currentTime, Math.floor)}</span>
                <span className="time">{formatTime(props.duration, Math.round)}</span>
            </div>
        </div>
    )
}
