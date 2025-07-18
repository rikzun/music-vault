import {
    type WritableAtom,
    useAtom as useJotaiAtom
} from "jotai"

export type AtomHook<Value, Args extends unknown[], Result> = {
    value: Value
    set: SetAtom<Args, Result>
} & (
    Value extends boolean ? {
        invert: () => void
    } : {}
)

export type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result

export function useAtom<Value, Args extends unknown[], Result>(
    atom: WritableAtom<Value, Args, Result>
): AtomHook<Value, Args, Result> {
    const [value, set] = useJotaiAtom(atom)

    return {
        value,
        set,
        //@ts-ignore
        invert: () => set((v) => !v)
    }
}