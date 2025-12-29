import { useTrueClick } from "@utils/hooks/useTrueClick"
import "./Button.style.scss"
import { ButtonIconProps, ButtonMenuProps, ButtonSmallProps, ButtonTextProps, ButtonTinyProps } from "./Button.types"

export namespace Button {
    export function Menu(props: ButtonMenuProps) {
        const trueClick = useTrueClick(props.onClick)

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
                style={props.color ? { color: props.color } : undefined}
                {...trueClick}
            >
                <div className="button-content">
                    <props.icon htmlColor="var(--background-color)" />
                </div>
            </button>
        )
    }

    export function Small(props: ButtonSmallProps) {
        const trueClick = useTrueClick(props.onClick)

        let className = "button-component button-small"
        if (props.fullWidth) className += " button-small__full-width"
        if (props.className) className += " " + props.className

        return (
            <button
                aria-label={props["aria-label"]}
                data-pm={JSON.stringify(props["data-pm"])}
                data-pmi={JSON.stringify(props["data-pmi"])}
                className={className}
                children={props.value}
                style={props.color ? { color: props.color } : undefined}
                {...trueClick}
            />
        )
    }

    export function Tiny(props: ButtonTinyProps) {
        const trueClick = useTrueClick(props.onClick)

        let className = "button-component button-tiny"
        if (props.fullWidth) className += " button-tiny__full-width"
        if (props.className) className += " " + props.className

        return (
            <button
                aria-label={props["aria-label"]}
                data-pm={JSON.stringify(props["data-pm"])}
                data-pmi={JSON.stringify(props["data-pmi"])}
                className={className}
                children={props.value}
                style={props.color ? { color: props.color } : undefined}
                {...trueClick}
            />
        )
    }

    export function Text(props: ButtonTextProps) {
        const trueClick = useTrueClick(props.onClick)

        let className = "button-component button-text"
        if (props.className) className += " " + props.className

        return (
            <button
                aria-label={props["aria-label"]}
                data-pm={JSON.stringify(props["data-pm"])}
                data-pmi={JSON.stringify(props["data-pmi"])}
                className={className}
                children={props.value}
                style={props.color ? { color: props.color } : undefined}
                {...trueClick}
            />
        )
    }

    export function Icon(props: ButtonIconProps) {
        const trueClick = useTrueClick(props.onClick)

        let className = "button-component button-icon"
        if (props.className) className += " " + props.className
        
        return (
            <button
                aria-label={props["aria-label"]}
                data-pm={JSON.stringify(props["data-pm"])}
                data-pmi={JSON.stringify(props["data-pmi"])}
                className={className}
                children={<props.icon />}
                ref={props.ref}
                style={props.color ? { color: props.color } : undefined}
                {...trueClick}
            />
        )
    }
}