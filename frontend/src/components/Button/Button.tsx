import { CSSProperties } from "@mui/material"
import "./Button.style.scss"
import { ButtonIconProps, ButtonMenuProps, ButtonSmallProps, ButtonTextProps, ButtonTinyProps } from "./Button.types"
import { handleEnter } from "@utils/events"

export namespace Button {
    export function Menu(props: ButtonMenuProps) {
        let className = "button-component button-menu"
        if (props.className) className += " " + props.className
        if (props.isPressed) className += " button-component__active"

        return (
            <button
                aria-label={props["aria-label"]}
                data-pm={JSON.stringify(props["data-pm"])}
                data-pmi={JSON.stringify(props["data-pmi"])}
                aria-pressed={props.isPressed}
                className={className}
                onPointerDown={props.onClick ? ((e) => e.button == 0 && props.onClick!(e)) : undefined}
                onKeyDown={handleEnter}
                style={props.color ? { color: props.color } : undefined}
            >
                <div className="button-content">
                    <props.icon htmlColor="var(--background-color)" />
                </div>
            </button>
        )
    }

    export function Small(props: ButtonSmallProps) {
        let className = "button-component button-small"
        if (props.fullWidth) className += " button-small__full-width"
        if (props.className) className += " " + props.className

        return (
            <button
                aria-label={props["aria-label"]}
                data-pm={JSON.stringify(props["data-pm"])}
                data-pmi={JSON.stringify(props["data-pmi"])}
                className={className}
                onPointerDown={props.onClick ? ((e) => e.button == 0 && props.onClick!(e)) : undefined}
                onKeyDown={handleEnter}
                children={props.value}
                style={props.color ? { color: props.color } : undefined}
            />
        )
    }

    export function Tiny(props: ButtonTinyProps) {
        let className = "button-component button-tiny"
        if (props.fullWidth) className += " button-tiny__full-width"
        if (props.className) className += " " + props.className

        return (
            <button
                aria-label={props["aria-label"]}
                data-pm={JSON.stringify(props["data-pm"])}
                data-pmi={JSON.stringify(props["data-pmi"])}
                className={className}
                onPointerDown={props.onClick ? ((e) => e.button == 0 && props.onClick!(e)) : undefined}
                onKeyDown={handleEnter}
                children={props.value}
                style={props.color ? { color: props.color } : undefined}
            />
        )
    }

    export function Text(props: ButtonTextProps) {
        let className = "button-component button-text"
        if (props.className) className += " " + props.className

        return (
            <button
                aria-label={props["aria-label"]}
                data-pm={JSON.stringify(props["data-pm"])}
                data-pmi={JSON.stringify(props["data-pmi"])}
                className={className}
                onPointerDown={props.onClick ? ((e) => e.button == 0 && props.onClick!(e)) : undefined}
                onKeyDown={handleEnter}
                children={props.value}
                style={props.color ? { color: props.color } : undefined}
            />
        )
    }

    export function Icon(props: ButtonIconProps) {
        let className = "button-component button-icon"
        if (props.className) className += " " + props.className
        
        return (
            <button
                aria-label={props["aria-label"]}
                data-pm={JSON.stringify(props["data-pm"])}
                data-pmi={JSON.stringify(props["data-pmi"])}
                className={className}
                onPointerDown={props.onClick ? ((e) => e.button == 0 && props.onClick!(e)) : undefined}
                onKeyDown={handleEnter}
                children={<props.icon />}
                ref={props.ref}
                style={props.color ? { color: props.color } : undefined}
            />
        )
    }
}