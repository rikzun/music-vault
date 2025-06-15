import {
    type WritableAtom,
    useAtom as useJotaiAtom
} from "jotai"

export type AtomHook<Value, Args extends unknown[], Result> = Value extends boolean ? {
    value: Value
    set: SetAtom<Args, Result>
    invert: () => void
} : {
    value: Value
    set: SetAtom<Args, Result>
}

export type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result

export function useAtom<Value, Args extends unknown[], Result>(atom: WritableAtom<Value, Args, Result>): AtomHook<Value, Args, Result> {
    const [value, set] = useJotaiAtom(atom)

    return {
        value,
        set,
        invert: () => {
            //@ts-ignore
            set((v) => !v)
        }
    } as AtomHook<Value, Args, Result>
}