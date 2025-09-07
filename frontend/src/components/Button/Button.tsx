import "./Button.style.scss"
import { ButtonPropsMenu, ButtonPropsSmall, ButtonPropsText } from "./Button.types"

export namespace Button {
    export function Menu(props: ButtonPropsMenu) {
        let className = "button-component button-menu"
        if (props.className) className += " " + props.className
        if (props.isPressed) className += " button-component__active"

        return (
            <button
                aria-label={props["aria-label"]}
                aria-pressed={props.isPressed}
                className={className}
                onClick={props.onClick}
            >
                <div className="content">
                    <props.icon color="var(--background-color)" />
                </div>
            </button>
        )
    }

    export function Small(props: ButtonPropsSmall) {
        let className = "button-component button-small"
        if (props.fullWidth) className += " button-small__full-width"
        if (props.className) className += " " + props.className

        return (
            <button
                aria-label={props["aria-label"]}
                className={className}
                onClick={props.onClick}
                children={props.value}
            />
        )
    }

    export function Text(props: ButtonPropsText) {
        let className = "button-component button-text"
        if (props.className) className += " " + props.className

        return (
            <button
                aria-label={props["aria-label"]}
                className={className}
                onClick={props.onClick}
                children={props.value}
            />
        )
    }
}