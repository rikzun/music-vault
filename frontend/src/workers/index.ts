import { TrackWorkerRPC } from "./track.worker"

export namespace Workers {
    export function Track() {
        return TrackWorkerRPC.wrap(() => {
            return new Worker(new URL("@workers/track.worker.ts", import.meta.url))
        })
    }
}