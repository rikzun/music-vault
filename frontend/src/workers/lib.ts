import * as Comlink from "comlink"

export namespace WorkerLib {
    export function isWebsocketSupported() {
        return typeof Worker !== "undefined"
    }

    export abstract class RPC {
        fromWorker: boolean
    
        constructor(fromWorker: boolean = false) {
            this.fromWorker = fromWorker
        }

        static wrap<T extends RPC>(this: new (...args: any[]) => T, cb: () => Worker) {
            const supported = isWebsocketSupported()

            const rpc = new this()
            const worker = supported ? cb() : {} as Worker

            worker.addEventListener("error", (e) => {
                console.log("WORKER ERROR", e)
            })

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