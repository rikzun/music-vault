import "./PopupMenu.styles.scss"
import { DefaultMenu } from "./PopupMenuDefault"
import { useState } from "@utils/hooks"
import { Fragment, PropsWithChildren, useLayoutEffect } from "react"
import { TouchMenu } from "./PopupMenuTouch"
import { Plane } from "@components/Plane"
import { PopupMenuAtoms } from "@atoms/popupMenu"
import { PopupMenuInitiator } from "src/common/popupMenu"

export function PopupMenuProvider(props: PropsWithChildren) {
    const defaultMenuData = PopupMenuAtoms.useDefaultPosition()
    const touchMenuData = useState<true | null>(null)

    useLayoutEffect(() => {
        const onClickPMI = (target: HTMLElement) => {
            const pmi = JSON.parse(target.dataset["pmi"]!) as PopupMenuInitiator
            const rect = target.getBoundingClientRect()

            const anchorH = pmi.anchorH ?? "left"
            const anchorV = pmi.anchorV ?? "bottom"

            let xPos: number
            let yPos: number

            switch(anchorH) {
                case "left": { xPos = rect.left; break }
                case "center": { xPos = rect.width / 2; break }
                case "right": { xPos = rect.right; break }
            }

            switch(anchorV) {
                case "top": { yPos = rect.top; break }
                case "center": { yPos = rect.height / 2; break }
                case "bottom": { yPos = rect.bottom; break }
            }
            
            defaultMenuData.set({
                type: pmi.type,
                transformH: pmi.transformH,
                transformV: pmi.transformV,
                x: xPos,
                y: yPos
            })
        }
        
        const onClickCM = (e: MouseEvent, target: HTMLElement) => {
            const pmi = JSON.parse(target.dataset["pm"]!) as PopupMenuInitiator
            defaultMenuData.set({type: pmi.type, x: e.pageX, y: e.pageY})
        }

        const onTouchCM = (e: TouchEvent, target: HTMLElement) => {
            const pmi = JSON.parse(target.dataset["pm"]!) as PopupMenuInitiator
            touchMenuData.set(true)
        }

        let pointerTarget: HTMLElement | null = null

        const pointerDownListener = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            if (e.button !== 0) return

            const target = (e.target as HTMLElement)
                ?.closest("[data-pmi]") as HTMLElement

            if (!target) return
            pointerTarget = target
        }

        const pointerUpListener = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            if (e.button !== 0) return
            if (!pointerTarget) return

            const target = (e.target as HTMLElement)
                ?.closest("[data-pmi]") as HTMLElement
            
            if (pointerTarget === target) onClickPMI(target)
            pointerTarget = null
        }

        const defaultListener = (e: MouseEvent) => {
            e.preventDefault()

            const target = (e.target as HTMLElement)
                ?.closest("[data-pm]") as HTMLElement

            if (!target) return
            onClickCM(e, target)
        }

        let touchStartTimeoutID: NodeJS.Timeout

        const touchListener = (e: TouchEvent) => {
            const target = (e.target as HTMLElement)
                ?.closest("[data-pm]") as HTMLElement

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

        document.body.addEventListener("pointerdown", pointerDownListener, { passive: false })
        document.body.addEventListener("pointerup", pointerUpListener, { passive: false })

        document.body.addEventListener("contextmenu", defaultListener, { passive: false })
        document.body.addEventListener("touchstart", touchListener, { passive: false })
        document.body.addEventListener("touchend", touchEndListener)
        window.addEventListener("resize", windowResize)

        return () => {
            document.body.removeEventListener("pointerdown", pointerDownListener)
            document.body.removeEventListener("pointerup", pointerUpListener)

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

            <DefaultMenu />

            {touchMenuData.value && (
                <TouchMenu />
            )}
        </Fragment>
    )
}