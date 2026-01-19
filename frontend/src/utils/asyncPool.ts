export type AsyncPoolAddCallback<T> = () => Promise<T>

interface QueueTask<T> {
    cb: AsyncPoolAddCallback<T>
    resolve: (value: T) => void
    reject: (reason?: any) => void
}

export class AsyncPool {
    limit: number
    active: number = 0
    queue: QueueTask<any>[] = []

    constructor(limit: number) {
        this.limit = limit
    }

    add<T>(cb: AsyncPoolAddCallback<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const task: QueueTask<T> = { cb, resolve, reject }

            if (this.active < this.limit) this.exec(task)
            else this.queue.push(task)
        })
    }

    private async exec<T>(task: QueueTask<T>) {
        this.active++

        try {
            task.resolve(await task.cb())
        } catch {
            task.reject()
        } finally {
            this.active--
            this.next()
        }
    }

    private next() {
        if (this.active >= this.limit) return
        
        const task = this.queue.shift()
        if (!task) return

        this.exec(task)
    }
}