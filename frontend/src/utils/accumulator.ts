export type AccumulatorCompareFn<T> = (a: T, b: T) => boolean

export interface AccumulatorData<T, Info> {
    delayMs?: number
    compareFn?: AccumulatorCompareFn<T>
    action: (items: T[], info: Info) => void
}

export class Accumulator<T, Info = unknown> {
    private delayMs: number
    private compareFn: AccumulatorCompareFn<T>
    private action: AccumulatorData<T, Info>["action"]

    private timer: NodeJS.Timeout | undefined
    private info: Info | undefined
    private items: T[] = []

    constructor(data: AccumulatorData<T, Info>) {
        this.delayMs = data.delayMs ?? 250
        this.compareFn = data.compareFn ?? ((a, b) => a === b)
        this.action = data.action
    }

    private updateTimer() {
        clearTimeout(this.timer)

        this.timer = setTimeout(() => {
            this.action(this.items, this.info!)
            this.items.length = 0
        }, this.delayMs)
    }

    setInfo(info: Info) {
        this.info = info
    }

    flush() {
        clearTimeout(this.timer)
        this.action(this.items, this.info!)
        this.items.length = 0
        this.info = undefined
    }

    add(item: T) {
        this.updateTimer()
        this.items.push(item)
    }

    remove(item: T) {
        const index = this.items.findIndex((v) => this.compareFn(v, item))
        if (index == -1) return

        this.updateTimer()
        this.items.splice(index, 1)
    }
}