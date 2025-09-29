import { OverlayScrollbarsComponent } from "overlayscrollbars-react"
import { PropsWithChildren } from "react"

interface ScrollbarProps extends PropsWithChildren {
    className?: string
}

export function Scrollbar(props: ScrollbarProps) {
    return (
        <OverlayScrollbarsComponent
            className={props.className}
            options={{
                scrollbars: {
                    autoHide: "leave",
                    autoHideDelay: 0
                }
            }}
            defer
            children={props.children}
        />
    )
}