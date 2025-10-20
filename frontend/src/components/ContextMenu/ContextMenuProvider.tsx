import "./ContextMenu.styles.scss"
import { DefaultContextMenuData, DefaultMenu } from "@components/ContextMenu/ContextMenuDefault"
import { useState } from "@utils/hooks"
import { Fragment, PropsWithChildren, useLayoutEffect } from "react"
import { Plane } from "@components/ContextMenu/ContextMenuPlane"
import { TouchMenu } from "@components/ContextMenu/ContextMenuTouch"

export function ContextMenuProvider(props: PropsWithChildren) {
    const defaultMenuData = useState<DefaultContextMenuData | null>(null)
    const touchMenuData = useState<true | null>(null)

    useLayoutEffect(() => {
        const onClickCM = (e: MouseEvent, target: Element) => {
            defaultMenuData.set({xPos: e.pageX, yPos: e.pageY})
        }

        const onTouchCM = (e: TouchEvent, target: Element) => {
            touchMenuData.set(true)
        }

        const defaultListener = (e: MouseEvent) => {
            e.preventDefault()

            const target = (e.target as HTMLElement)?.closest("[data-cm]")
            if (!target) return

            onClickCM(e, target)
        }

        let touchStartTimeoutID: NodeJS.Timeout

        const touchListener = (e: TouchEvent) => {
            const target = (e.target as HTMLElement)?.closest("[data-cm]")

            if (!target) return
            e.preventDefault()

            touchStartTimeoutID = setTimeout(() => {
                onTouchCM(e, target)
            }, 500)
        }

        const touchEndListener = () => {
            clearTimeout(touchStartTimeoutID)
        }

        const windowResize = () => {
            defaultMenuData.set(null)
            touchMenuData.set(null)
        }

        document.body.addEventListener("contextmenu", defaultListener, { passive: false })
        document.body.addEventListener("touchstart", touchListener, { passive: false })
        document.body.addEventListener("touchend", touchEndListener)
        window.addEventListener("resize", windowResize)

        return () => {
            document.body.removeEventListener("contextmenu", defaultListener)
            document.body.removeEventListener("touchstart", touchListener)
            document.body.removeEventListener("touchend", touchEndListener)
            window.removeEventListener("resize", windowResize)
        }
    }, [])

    return (
        <Fragment>
            {props.children}

            {(defaultMenuData.value || touchMenuData.value) && (
                <Plane
                    onPointerDown={() => defaultMenuData.set(null)}
                    onTouchStart={() => touchMenuData.set(null)}
                />
            )}

            {defaultMenuData.value && (
                <DefaultMenu
                    data={defaultMenuData.value}
                />
            )}

            {touchMenuData.value && (
                <TouchMenu />
            )}
        </Fragment>
    )
}