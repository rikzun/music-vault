import { useEffect, useRef } from "react"

export function TrackWaveform(props: {data: number[]}) {
    const canvasRef = useRef<HTMLCanvasElementN>(null)
    const width = 500
    const height = 200
  
    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        ctx.reset()
        ctx.clearRect(0, 0, width, height)
        ctx.translate(0.5, 0.5)
        
        if (!props.data) return

        const centerY = height / 2
        const barWidth = 4

        ctx.beginPath()
        ctx.fillStyle = "white"

        let lastIndex = 0

        for (let i = 0; i < props.data.length; i += barWidth) {
            const values: Array<number> = []

            for (let ii = lastIndex; ii < i; ii += 1) {
                values.push(props.data[ii])
            }

            const x = i
            const y = centerY
            const mid = (values.reduce((prev, curr) => prev + curr, 0) / values.length) * 4

            ctx.rect(x, y, barWidth, mid)
            ctx.rect(x, y, barWidth, -mid)

            lastIndex = i
        }

        props.data.forEach((value, index) => {
            const x = index * barWidth
            const y = centerY

            ctx.rect(x, y, barWidth, value)
            ctx.rect(x, y, barWidth, -value)
        })
        
        ctx.closePath()
        ctx.fill()

    }, [props.data])
  
    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ 
                border: '1px solid var(--background-main-color)',
                borderRadius: '8px',
                backgroundColor: 'var(--background-main-color)'
            }}
        />
    )
}
