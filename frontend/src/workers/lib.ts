import * as Comlink from "comlink"

export namespace WorkerLib {
    const supported = isWebsocketSupported()
    
    export function isWebsocketSupported() {
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
    }

    export abstract class RPC {
        fromWorker: boolean
    
        constructor(fromWorker: boolean = false) {
            this.fromWorker = fromWorker
        }

        static wrap<T extends RPC>(this: new (...args: any[]) => T, cb: () => Worker) {
            const rpc = new this()
            const worker = supported ? cb() : {} as Worker

            Object.assign(worker, {
                rpc: supported ? Comlink.wrap<T>(worker) : rpc,
                default: rpc
            })

            return worker as WorkerRPC<OnlyFunctions<T>>
        }
    }

    export type WorkerRPC<T> = Worker & {
        rpc: T
        default: T
    }

    type OnlyFunctions<T> = {
        [K in keyof T as T[K] extends (...args: any) => any ? K : never]: T[K]
    }
}