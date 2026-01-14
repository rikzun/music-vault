import { clamp } from "@utils/std"
import "./CircleProgress.styles.scss"

interface CircleProgressProps {
    /** number from 0 to 100 */
    value: number

    size?: string | number
}

const dasharray = 126.920

export function CircleProgress(props: CircleProgressProps) {
    const progress = clamp(props.value, 0, 100)
    const size = props.size != null
        ? typeof props.size === "number"
            ? props.size + "px"
            : props.size
        : "40px"

    return (
        <div className="circle-progress-component" style={{width: size, height: size}}>
            <svg viewBox="22 22 44 44">
                <circle
                    r="20.2"
                    cx="44"
                    cy="44"
                    fill="none"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    strokeDasharray={dasharray + "px"}
                    strokeDashoffset={dasharray - (dasharray * progress / 100) + "px"}
                />
            </svg>
        </div>
    )
}