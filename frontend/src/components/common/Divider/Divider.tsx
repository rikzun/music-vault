import "./Divider.style.scss"

export type DividerChar =
    | "dot"
    | "slash"

export type DividerSize =
    | "default"
    | "auto"
    | "small"

export interface DividerProps {
    char?: DividerChar
    size?: DividerSize
}

export function Divider(props: DividerProps) {
    let className = "divider-component"
    className += " divider-component__" + (props.size ?? "default")

    let char = "•"
    switch (props.char) {
        case "slash": char = "/"
    }

    return (
        <span
            className={className}
            children={char}
        />
    )
}