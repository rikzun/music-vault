import "./Divider.style.scss"

export type DividerSize =
    | "default"

export interface DividerProps {
    size?: DividerSize
}

export function Divider(props: DividerProps) {
    let className = "divider-component"
    className += " divider-component__" + (props.size ?? "default")

    return (
        <span
            className={className}
            children="•"
        />
    )
}