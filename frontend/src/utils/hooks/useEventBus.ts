import { useEffect } from "react"
import { EventBusType } from "src/common/eventBus"
import mitt from "mitt"

const emitter = mitt()

export function useEventBus(type: EventBusType, cb: () => void) {
    useEffect(() => {
        emitter.on(type, cb)

        return () => {
            emitter.off(type, cb)
        }
    }, [cb])
}
