import "./Button.style.scss"
import { ButtonIconProps, ButtonMenuProps, ButtonSmallProps, ButtonTextProps } from "./Button.types"
import { handleEnter } from "@utils/events"

export namespace Button {
    export function Menu(props: ButtonMenuProps) {
        let className = "button-component button-menu"
        if (props.className) className += " " + props.className
        if (props.isPressed) className += " button-component__active"

        return (
            <button
                aria-label={props["aria-label"]}
                data-cm={props["data-cm"]}
                aria-pressed={props.isPressed}
                className={className}
                onPointerDown={(e) => e.button == 0 && props.onClick(e)}
                onKeyDown={handleEnter}
            >
                <div className="content">
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
                data-cm={props["data-cm"]}
                className={className}
                onPointerDown={(e) => e.button == 0 && props.onClick(e)}
                onKeyDown={handleEnter}
                children={props.value}
            />
        )
    }

    export function Text(props: ButtonTextProps) {
        let className = "button-component button-text"
        if (props.className) className += " " + props.className

        return (
            <button
                aria-label={props["aria-label"]}
                data-cm={props["data-cm"]}
                className={className}
                onPointerDown={(e) => e.button == 0 && props.onClick(e)}
                onKeyDown={handleEnter}
                children={props.value}
            />
        )
    }

    export function Icon(props: ButtonIconProps) {
        let className = "button-component button-icon"
        if (props.className) className += " " + props.className

        return (
            <button
                aria-label={props["aria-label"]}
                data-cm={props["data-cm"]}
                className={className}
                onPointerDown={(e) => e.button == 0 && props.onClick(e)}
                onKeyDown={handleEnter}
                children={<props.icon />}
                ref={props.ref}
            />
        )
    }
}