import { useEffect, useRef } from "react"

interface TrackWaveformProps {
    samples: number[]
    currentTime: numberN
    duration: numberN
    onTimeChange: (newTime: number) => void
}

export function TrackWaveform(props: TrackWaveformProps) {
    const canvasRef = useRef<HTMLCanvasElementN>(null)
    const width = 500
    const height = 150
    const actualMaxHeight = height * .5
  
    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!

        ctx.reset()
        ctx.clearRect(0, 0, width, height)
        ctx.translate(0.5, 0.5)
        
        if (!props.samples || !props.duration) return

        const trackPercent = (props.currentTime ?? 0) / props.duration

        const centerY = height / 2
        const barWidthWithSpace = Math.round(width / props.samples.length)
        const barWidth = barWidthWithSpace - 2

        // ctx.beginPath()
        // ctx.fillStyle = "white"

        props.samples.forEach((value, index) => {
            const x = (index * barWidthWithSpace)
            const y = centerY

            const barHeight = (Math.abs(value) * (actualMaxHeight / 100))

            const xPercent = x / width
            if (xPercent <= trackPercent) {
                ctx.fillStyle = "red"
            } else {
                ctx.fillStyle = "white"
            }

            ctx.beginPath()
            ctx.rect(x, y, barWidth, -barHeight)
            ctx.rect(x, y + 4, barWidth, (barHeight / 4))
            ctx.fill()
            ctx.closePath()
        })

        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.rect(0, centerY + 1, width, 2)
        ctx.fill()
        ctx.closePath()
    }, [props.samples, props.currentTime, props.duration])
  
    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onPointerUp={(e) => {
                const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
                const point = e.pageX - rect.left
                const percent = point / rect.width

                props.onTimeChange(percent * (props.duration ?? 0))
            }}
        />
    )
}
