import { Dispatch, SetStateAction, useState } from "react";

export type StorageDispatcher<T> = Dispatch<SetStateAction<T>>

export type Storage<T> = T extends boolean ? {
    value: T
    set: StorageDispatcher<boolean>
    invert: () => void
} : {
    value: T
    set: StorageDispatcher<T>
}

export function useStorage<T>(value: T): Storage<T> {
    const [state, setState] = useState<T>(value);

    return {
        value: state,
        set: setState,
        invert: () => (setState as StorageDispatcher<boolean>)((v) => !v)
    } as Storage<T>
}
