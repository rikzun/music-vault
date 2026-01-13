import "./Input.style.scss"
import { InputExpandedProps, InputImageProps } from "@components/common/Input"
import { useInput } from "@utils/hooks"
import { useTrueClick } from "@utils/hooks/useTrueClick"
import SearchRounded from "@mui/icons-material/SearchRounded"
import HideImageRounded from "@mui/icons-material/HideImageRounded"

export namespace Input {
    export function Expanded(props: InputExpandedProps) {
        return (
            <textarea
                spellCheck={false}
                value={props.value || undefined}
                defaultValue={props.defaultValue || undefined}
                className="input-component input-component-expanded"
                onChange={(e) => {
                    props.onChange?.(e.target.value)
                    
                    e.target.style.height = "0"
                    const height = e.target.scrollHeight + 2
                    e.target.style.height = height + "px"
                }}
            />
        )
    }

    export function Image(props: InputImageProps) {
        const input = useInput({ handler: props.onChange })
        const trueClick = useTrueClick(input.click)

        let className = "input-component input-component-image"
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