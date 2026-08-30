import { OverlayScrollbarsComponent } from "overlayscrollbars-react"
import { PropsWithChildren } from "react"

export function Scrollbar(props: PropsWithChildren) {
    return (
        <OverlayScrollbarsComponent
            className="scrollbar-host"
            options={{
                scrollbars: {
                    autoHide: "leave",
                    autoHideDelay: 0
                }
            }}
            events={{
                initialized: (instance) => {
                    const viewport = instance.elements().viewport
                    viewport.classList.add("scrollbar-viewport")
                }
            }}
            defer
            children={props.children}
        />
    )
}