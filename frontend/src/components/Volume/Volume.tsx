import './Volume.style.scss'
import { useState } from '@utils/hooks'
import { KeyboardEvent, SyntheticEvent, WheelEvent, useEffect, useLayoutEffect, useRef } from 'react'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md'

const THUMB_SIZE = 12

export function Volume() {
    const rangeRef = useRef<HTMLDivElement|null>(null)
    const thumbRef = useRef<HTMLDivElement|null>(null)
    const volumeInputRef = useRef<HTMLInputElement|null>(null)
    const handleMouseMove = useState(false)

    const muted = useState(false)
    const volume = useState(Number.parseInt(localStorage.getItem('volume') ?? '') || 50)

    useLayoutEffect(() => {
        const savedVolume = localStorage.getItem('volume') ?? '50'
        thumbRef.current!.style.left = `calc(${savedVolume}% - ${THUMB_SIZE}px)`
    }, [])

    const setVolume = (percent: number) => {
        volume.set(percent)
        localStorage.setItem('volume', percent.toString())
    }

    const setVolumeInput = (percent: number) => {
        volumeInputRef.current!.value = percent.toString()
    }

    // FIX left anchor VAHBKAWHLSJDAJWILFH
    useEffect(() => {
        if (!handleMouseMove.value) return

        const moveListener = (e: PointerEvent) => {
            const rangeRect = rangeRef.current!.getBoundingClientRect()
            const start = rangeRect.x
            const end = rangeRect.width - THUMB_SIZE

            let current = e.pageX - start
            if (current < 0) current = 0
            if (current > end) current = end

            let left = current
            if (left < 0) left = 0
            if (left > end) left = end
            
            thumbRef.current!.style.left = left + 'px'

            const percent = Math.floor((current / end) * 100)
            setVolume(percent)
            setVolumeInput(percent)
        }

        const upListener = () => {
            handleMouseMove.set(false)
        }

        addEventListener('pointermove', moveListener)
        addEventListener('pointerup', upListener, { once: true })

        return () => {
            removeEventListener('pointermove', moveListener)
        }
    }, [handleMouseMove])

    const onMouseWheel = (e: WheelEvent<HTMLDivElement>) => {
        let value = (e.deltaY < 0 ? 1 : -1)
        if (e.shiftKey) value *= 5

        const end = rangeRef.current!.getBoundingClientRect().width - THUMB_SIZE

        let next = volume.value + value
        if (next < 0) next = 0
        if (next > 100) next = 100

        let left = end * (next / 100)
        if (left < 0) left = 0
        if (left > end) left = end

        setVolume(next)
        thumbRef.current!.style.left = left + 'px'
        setVolumeInput(next)
    }

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Tab") return
        if (e.key == "Enter") return
        if (e.key == "Backspace") return
        if (e.key == ".") return
        if (e.key == "ArrowLeft") return
        if (e.key == "ArrowRight") return
        if (e.key == "a" && e.ctrlKey) return
        if (e.key == "x" && e.ctrlKey) return

        const target = e.currentTarget
        const value = target.value
        
        if (value.length == 3 && (target.selectionStart == target.selectionEnd)) {
            e.preventDefault()
            return
        }

        if (/^\d+$/.test(e.key)) return
        e.preventDefault()
    }

    const onBlur = (e: SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        const value = target.value
        let number = Number(value)

        if (Number.isNaN(number) || value == '') {
            target.value = volume.value.toString()
            target.blur()
            return
        }

        if (value.startsWith('0')) {
            target.value = number.toString()
        }

        if (number > 300) {
            number = 300
            target.value = '300'
        }

        const end = rangeRef.current!.getBoundingClientRect().width - THUMB_SIZE

        let left = end * (number / 100)
        if (left < 0) left = 0
        if (left > end) left = end
        thumbRef.current!.style.left = left + 'px'

        setVolume(number)
        target.blur()
    }

    return (
        <div className="volume">
            <button className="volume-icon" onClick={() => muted.invert()}>
                {muted.value ? <MdVolumeOff /> : <MdVolumeUp /> }
            </button>

            <div
                tabIndex={0}
                ref={rangeRef}
                className="range"
                onMouseDown={() => handleMouseMove.set(true)}
                onWheel={onMouseWheel}
            >
                <div
                    className="track"
                >
                    <div
                        ref={thumbRef}
                        className="thumb"
                        style={{
                            "--thumb-size": THUMB_SIZE + 'px'
                        } as Record<string, string>}
                    />
                </div>
            </div>

            <input
                type="text"
                ref={volumeInputRef}
                defaultValue={volume.value}
                onKeyDown={onKeyDown}
                onKeyUp={(e) => e.key == "Enter" ? onBlur(e) : undefined}
                onBlur={onBlur}
            />
        </div>
    )
}