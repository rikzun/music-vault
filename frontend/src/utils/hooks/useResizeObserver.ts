import { RefCallback, RefObject, useCallback, useEffect, useRef } from "react"

export function useResizeObserver(callback: (entries: ResizeObserverEntry[]) => void): RefCallback<HTMLElement>
export function useResizeObserver(callback: (entries: ResizeObserverEntry[]) => void, ref: RefObject<HTMLElement | null>): void
export function useResizeObserver(callback: (entries: ResizeObserverEntry[]) => void, ref?: RefObject<HTMLElement | null>): RefCallback<HTMLElement> | void {
    const instanceRef = ref ? ref : useRef<HTMLElement>(null)
    const observerRef = useRef<ResizeObserver>(null)

    const refCallback = useCallback((instance: HTMLElement | null) => {
        if (instanceRef.current && observerRef.current) {
            observerRef.current.unobserve(instanceRef.current)
        }

        if (!instance) return
        instanceRef.current = instance

        if (!observerRef.current) {
            observerRef.current = new ResizeObserver(callback)
        }

        observerRef.current.observe(instanceRef.current)
    }, [callback]) as RefCallback<HTMLElement>

    useEffect(() => {
        return () => {
            observerRef.current?.disconnect()
            observerRef.current = null
        }
    }, [])

    if (ref === undefined) return refCallback
}