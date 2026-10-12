import type {
    ClipboardEvent,
    CompositionEvent,
    DragEvent,
    PointerEvent,
    FocusEvent,
    SubmitEvent,
    ChangeEvent,
    InputEvent,
    KeyboardEvent,
    MouseEvent,
    TouchEvent,
    WheelEvent,
    AnimationEvent,
    TransitionEvent,
    EventHandler
} from "react"

export namespace ReactEvent {
    export type Clipboard   <T = Element>               = ClipboardEvent<T>
    export type Composition <T = Element>               = CompositionEvent<T>
    export type Drag        <T = Element>               = DragEvent<T>
    export type Pointer     <T = Element>               = PointerEvent<T>
    export type Focus       <T = Element, RT = Element> = FocusEvent<T, RT>
    export type Submit      <T = Element>               = SubmitEvent<T>
    export type Change      <T = Element>               = ChangeEvent<T>
    export type Input       <T = Element>               = InputEvent<T>
    export type Keyboard    <T = Element>               = KeyboardEvent<T>
    export type Mouse       <T = Element>               = MouseEvent<T>
    export type Touch       <T = Element>               = TouchEvent<T>
    export type Wheel       <T = Element>               = WheelEvent<T>
    export type Animation   <T = Element>               = AnimationEvent<T>
    export type Transition  <T = Element>               = TransitionEvent<T>

    export namespace Clipboard   { export type Handler <T = Element>               = EventHandler<ReactEvent.Clipboard<T>>   }
    export namespace Composition { export type Handler <T = Element>               = EventHandler<ReactEvent.Composition<T>> }
    export namespace Drag        { export type Handler <T = Element>               = EventHandler<ReactEvent.Drag<T>>        }
    export namespace Pointer     { export type Handler <T = Element>               = EventHandler<ReactEvent.Pointer<T>>     }
    export namespace Focus       { export type Handler <T = Element, RT = Element> = EventHandler<ReactEvent.Focus<T, RT>>   }
    export namespace Submit      { export type Handler <T = Element>               = EventHandler<ReactEvent.Submit<T>>      }
    export namespace Change      { export type Handler <T = Element>               = EventHandler<ReactEvent.Change<T>>      }
    export namespace Input       { export type Handler <T = Element>               = EventHandler<ReactEvent.Input<T>>       }
    export namespace Keyboard    { export type Handler <T = Element>               = EventHandler<ReactEvent.Keyboard<T>>    }
    export namespace Mouse       { export type Handler <T = Element>               = EventHandler<ReactEvent.Mouse<T>>       }
    export namespace Touch       { export type Handler <T = Element>               = EventHandler<ReactEvent.Touch<T>>       }
    export namespace Wheel       { export type Handler <T = Element>               = EventHandler<ReactEvent.Wheel<T>>       }
    export namespace Animation   { export type Handler <T = Element>               = EventHandler<ReactEvent.Animation<T>>   }
    export namespace Transition  { export type Handler <T = Element>               = EventHandler<ReactEvent.Transition<T>>  }
}