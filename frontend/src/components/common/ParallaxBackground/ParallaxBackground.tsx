import "./ParallaxBackground.styles.scss"
import { useEffect, useRef } from "react"

interface ParallaxBackgroundProps {
    imageURL?: string | null
}

export function ParallaxBackground(props: ParallaxBackgroundProps) {
    const ref = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const MAX_SHIFT = 15
        
        const onMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2
            const y = (e.clientY / window.innerHeight - 0.5) * 2

            const shiftX = x * MAX_SHIFT
            const shiftY = y * MAX_SHIFT

            if (ref.current) {
                ref.current.style.transition = ""
                ref.current.style.transform = `translate(${shiftX}px, ${shiftY}px)`
            }
        }

        const onMouseLeave = () => {
            if (ref.current) {
                ref.current.style.transition = 'transform 0.6s ease'
                ref.current.style.transform = ""
            }
        }

        addEventListener("mousemove", onMouseMove)
        document.body.addEventListener("mouseleave", onMouseLeave)

        return () => {
            removeEventListener("mousemove", onMouseMove)
            document.body.removeEventListener("mouseleave", onMouseLeave)
        }
    }, [])

    return (
        <img
            className="parallax-background-component"
            ref={ref}
            src={props.imageURL ?? undefined}
        />
    )
}