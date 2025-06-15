import {
    type Dispatch,
    type SetStateAction,
    useState as useReactState
} from "react"

export type StateHook<T> = T extends boolean ? {
    value: T
    set: StateDispatcher<boolean>
    invert: () => void
} : {
    value: T
    set: StateDispatcher<T>
}

export type StateDispatcher<T> = Dispatch<SetStateAction<T>>

export function useState<T>(value: T): StateHook<T> {
    const [state, setState] = useReactState<T>(value)

    return {
        value: state,
        set: setState,
        invert: () => (setState as StateDispatcher<boolean>)((v) => !v)
    } as StateHook<T>
}
