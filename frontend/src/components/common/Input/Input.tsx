import "./Input.style.scss"
import { InputTextProps, InputImageProps } from "@components/common/Input"
import { useInput } from "@utils/hooks"
import { useTrueClick } from "@utils/hooks/useTrueClick"
import SearchRounded from "@mui/icons-material/SearchRounded"
import HideImageRounded from "@mui/icons-material/HideImageRounded"

export namespace Input {
    const cl = "input-component"

    export function Expanded(props: InputTextProps) {
        const className = cl + " input-component-expanded"

        return (
            <textarea
                spellCheck={false}
                value={props.value || undefined}
                defaultValue={props.defaultValue || undefined}
                className={className}
                onChange={(e) => {
                    props.onChange?.(e.target.value)
                    
                    e.target.style.height = "0"
                    const height = e.target.scrollHeight + 2
                    e.target.style.height = height + "px"
                }}
            />
        )
    }

    export function Text(props: InputTextProps) {
        let className = cl + " input-component-text"
        if (props.fullWidth) className += " " + (cl + "__full-width")

        return (
            <input 
                type="text"
                title={props.value || undefined}
                spellCheck={false}
                value={props.value || undefined}
                defaultValue={props.defaultValue || undefined}
                className={className}
                onChange={(e) => props.onChange?.(e.target.value)}
            />
        )
    }

    export function Image(props: InputImageProps) {
        const input = useInput({ handler: props.onChange })
        const trueClick = useTrueClick(input.click)

        let className = cl + " input-component-image"
        if (!props.imageURL) className += " input-component-image__empty"

        return (
            <button className={className} {...trueClick}>
                <div className="cover">
                    <SearchRounded />
                </div>

                {props.imageURL
                    ? <img src={props.imageURL} />
                    : <HideImageRounded />
                }
            </button>
        )
    }
}