import * as Comlink from "comlink"
import { TrackWorkerRPC } from "./track.worker"

export namespace Workers {
    export const supported = (() => {
        if (typeof Worker === "undefined") return false
        try {
            const blob = new Blob([""], { type: "application/javascript" })
            const url = URL.createObjectURL(blob)
            const worker = new Worker(url)
            
            worker.terminate()
            URL.revokeObjectURL(url)
            return true
        } catch (e: unknown) {
            return false
        }
    })()

    export function Track() {
        return wrap(TrackWorkerRPC, () => {
            return new Worker(new URL("@workers/track.worker.ts", import.meta.url))
        })
    }

    type OnlyFunctions<T> = {
        [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K]
    }

    type WorkerRPC<T> = Worker & {
        rpc: T
        default: T
    }

    function wrap<T>(rpc: T, cb: () => Worker) {
        const worker = supported ? cb() : {} as Worker

        Object.assign(worker, {
            rpc: supported ? Comlink.wrap<T>(worker) : rpc,
            default: rpc
        })

        return worker as WorkerRPC<OnlyFunctions<T>>
    }
}