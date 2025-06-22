import {
    type Dispatch,
    type SetStateAction,
    useState as useReactState
} from "react"

export type StateHook<T> = {
    value: T
    set: StateDispatcher<T>
} & (
    T extends boolean ? {
        invert: () => void
    } : {}
)

export type StateDispatcher<T> = Dispatch<SetStateAction<T>>

export function useState<T>(value: T): StateHook<T> {
    const [state, setState] = useReactState<T>(value)

    return {
        value: state,
        set: setState,
        //@ts-ignore
        invert: () => setState((v) => !v)
    }
}
