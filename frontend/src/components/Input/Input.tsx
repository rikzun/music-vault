import { ExpandedInputProps } from "@components/Input/Input.types"
import "./Input.style.scss"

export namespace Input {
    export function Expanded(props: ExpandedInputProps) {
        return (
            <textarea
                spellCheck={false}
                value={props.value || undefined}
                defaultValue={props.defaultValue || undefined}
                className="input-component input-component__expanded"
                onChange={(e) => {
                    props.onChange?.(e.target.value)
                    
                    e.target.style.height = "0"
                    const height = e.target.scrollHeight + 2
                    e.target.style.height = height + "px"
                }}
            />
        )
    }
}