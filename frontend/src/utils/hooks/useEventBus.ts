import { useEffect } from "react"
import { EventBusData } from "src/types/eventBus"
import mitt from "mitt"

export namespace EventBus {
    const emitter = mitt<EventBusData>()

    export function emit<T extends keyof EventBusData>(type: T, data?: EventBusData[T]) {
        emitter.emit(type, data)
    }

    export function useListener<T extends keyof EventBusData>(type: T, cb: (data: EventBusData[T]) => void) {
        useEffect(() => {
            emitter.on(type, cb)
    
            return () => {
                emitter.off(type, cb)
            }
        }, [type, cb])
    }
}