import "./Volume.style.scss"
import { VolumeAtoms } from "@atoms/volume"
import { useState } from "@utils/hooks"
import { useEffect, useRef } from "react"
import { MdVolumeOff, MdVolumeUp } from "react-icons/md"
import { clamp } from "@utils/std"
import { ReactEvent } from "@utils/react"
import { Button } from "@components/Button"

const KNOB_SIZE = 12
const KNOB_SIZE_HALF = KNOB_SIZE / 2

export function Volume() {
    const volume = VolumeAtoms.useVolume()
    const muted = VolumeAtoms.useMuted()

    const position = useState(Math.min(volume.value, 100))
    const rangeRef = useRef<HTMLDivElementN>(null)
    const inputRef = useRef<HTMLInputElementN>(null)
    const handleMouseMove = useState(false)

    const muteVolume = () => {
        muted.invert((newValue) => {
            localStorage.setItem("volume.muted", newValue.toString())
        })
    }

    const setVolume = (value: number) => {
        volume.set(value)
        inputRef.current!.value = Math.floor(value).toString()
        localStorage.setItem("volume.value", value.toString())
    }

    const moveVolume = (posX: number, shiftKey?: boolean) => {
        const rect = rangeRef.current!.getBoundingClientRect()

        const pos = clamp(
            posX - rect.left,
            KNOB_SIZE_HALF,
            rect.width - KNOB_SIZE_HALF
        )

        let percent = ((pos - KNOB_SIZE_HALF) / (rect.width - KNOB_SIZE)) * 100

        if (shiftKey) {
            percent = Math.round(percent)
            const remainder = percent % 5

            if (remainder != 0) {
                percent += 5 - remainder
            }
        }

        setVolume(percent)
        position.set(percent)
        handleMouseMove.set(true)
    }

    const shiftVolume = (value?: number) => {
        if (value == null) return
        const percent = clamp(volume.value + value, 0, 100)

        setVolume(percent)
        position.set(percent)
    }

    const calculateShift = (e: ReactEvent.Wheel<HTMLDivElement> | ReactEvent.Keyboard) => {
        const mod = e.shiftKey ? 5 : 1

        if (e.nativeEvent instanceof WheelEvent) {
            return (e.nativeEvent.deltaY < 0 ? 1 : -1) * mod
        }

        if (e.nativeEvent instanceof KeyboardEvent) {
            if (e.target instanceof HTMLDivElement) {
                switch (e.nativeEvent.key) {
                    case "ArrowUp":
                    case "ArrowRight": {
                        return 1 * mod
                    }

                    case "ArrowDown":
                    case "ArrowLeft": {
                        return -1 * mod
                    }
                }
            }

            if (e.target instanceof HTMLInputElement) {
                switch (e.nativeEvent.key) {
                    case "ArrowUp": {
                        return 1 * mod
                    }

                    case "ArrowDown": {
                        return -1 * mod
                    }
                }
            }
        }
    }

    useEffect(() => {
        if (!handleMouseMove.value) return

        const pointerMoveListener = (e: PointerEvent) => moveVolume(e.clientX, e.shiftKey)
        const touchMoveListener = (e: TouchEvent) => moveVolume(e.touches[0].clientX, false)
        const upListener = () => handleMouseMove.set(false)

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
    }, [handleMouseMove])

    const onKeyDown = (e: ReactEvent.Keyboard<HTMLInputElement>) => {
        shiftVolume(calculateShift(e))

        if (e.key == "Tab") return
        if (e.key == "Enter") return
        if (e.key == "Backspace") return
        if (e.key == "ArrowLeft") return
        if (e.key == "ArrowRight") return
        if (e.key == "a" && e.ctrlKey) return
        if (e.key == "x" && e.ctrlKey) return

        const target = e.currentTarget
        const value = target.value

        if (value.length == 3 && target.selectionStart == target.selectionEnd) {
            e.preventDefault()
            return
        }

        if (/^\d+$/.test(e.key)) return
        e.preventDefault()
    }

    const onBlur = (target: HTMLInputElement) => {
        const stringPercent = target.value
        let numberPercent = Number.parseFloat(stringPercent)

        if (Number.isNaN(numberPercent) || stringPercent == "") {
            target.value = volume.value.toString()
            target.blur()
            return
        }

        if (stringPercent.startsWith("0")) {
            target.value = numberPercent.toString()
        }

        if (numberPercent > 300) {
            numberPercent = 300
            target.value = "300"
        }

        setVolume(numberPercent)
        position.set(clamp(numberPercent, 0, 100))
        target.blur()
    }

    return (
        <div className="volume">
            <Button.Icon
                aria-label="volume mute"
                onClick={muteVolume}
                icon={muted.value ? MdVolumeOff : MdVolumeUp}
            />

            <div
                tabIndex={0}
                ref={rangeRef}
                className="range"
                onPointerDown={(e) => e.button == 0 && moveVolume(e.clientX, e.shiftKey)}
                onKeyDown={(e) => shiftVolume(calculateShift(e))}
                onWheel={(e) => shiftVolume(calculateShift(e))}
            >
                <div className="track">
                    <div
                        className="knob"
                        style={{
                            left: `calc(${position.value}%)`,
                            transform: `translateX(-${(KNOB_SIZE * position.value) / 100}px)`,
                            "--knob-size": KNOB_SIZE + "px",
                        }}
                    />
                </div>
            </div>

            <input
                type="text"
                ref={inputRef}
                defaultValue={Math.floor(volume.value)}
                onWheel={(e) => shiftVolume(calculateShift(e))}
                onKeyDown={onKeyDown}
                onKeyUp={(e) => e.key == "Enter" && onBlur(e.currentTarget)}
                onBlur={(e) => onBlur(e.currentTarget)}
            />
        </div>
    )
}
