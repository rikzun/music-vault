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
    const height = 200
  
    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!

        ctx.reset()
        ctx.clearRect(0, 0, width, height)
        ctx.translate(0.5, 0.5)
        
        if (!props.samples || !props.duration) return

        const trackPercent = (props.currentTime ?? 0) / props.duration

        const centerY = height / 2
        const barWidth = 2

        // ctx.beginPath()
        // ctx.fillStyle = "white"

        let lastIndex = 0

        for (let i = 0; i < props.samples.length; i += barWidth) {
            const values: Array<number> = []

            for (let ii = lastIndex; ii < i; ii += 1) {
                values.push(props.samples[ii])
            }

            const x = i + (i * .5)
            const y = centerY
            const mid = (values.reduce((prev, curr) => prev + curr, 0) / values.length) * 4
            const height = -(Math.abs(mid) / 2)

            const xPercent = x / width
            if (xPercent <= trackPercent) {
                ctx.fillStyle = "red"
            } else {
                ctx.fillStyle = "white"
            }

            ctx.beginPath()
            ctx.rect(x, y, barWidth, height)
            // ctx.rect(x, y, barWidth, -height)
            ctx.fill()
            ctx.closePath()

            lastIndex = i
        }
        
        // ctx.closePath()
        // ctx.fill()

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
