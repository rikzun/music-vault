import type {
    ClipboardEvent,
    CompositionEvent,
    DragEvent,
    PointerEvent,
    FocusEvent,
    FormEvent,
    ChangeEvent,
    InputEvent,
    KeyboardEvent,
    MouseEvent,
    TouchEvent,
    WheelEvent,
    AnimationEvent,
    TransitionEvent
} from "react"

export namespace ReactEvent {
    export type Clipboard   <T = Element>                 = ClipboardEvent<T>
    export type Composition <T = Element>                 = CompositionEvent<T>
    export type Drag        <T = Element>                 = DragEvent<T>
    export type Pointer     <T = Element>                 = PointerEvent<T>
    export type Focus       <T = Element, RT = Element>   = FocusEvent<T, RT>
    export type Form        <T = Element>                 = FormEvent<T>
    export type Change      <T = Element>                 = ChangeEvent<T>
    export type Input       <T = Element>                 = InputEvent<T>
    export type Keyboard    <T = Element>                 = KeyboardEvent<T>
    export type Mouse       <T = Element, E = MouseEvent> = MouseEvent<T, E>
    export type Touch       <T = Element>                 = TouchEvent<T>
    export type Wheel       <T = Element>                 = WheelEvent<T>
    export type Animation   <T = Element>                 = AnimationEvent<T>
    export type Transition  <T = Element>                 = TransitionEvent<T>
}