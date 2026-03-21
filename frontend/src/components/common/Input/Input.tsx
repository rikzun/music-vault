import "./Input.style.scss"
import { InputTextProps, InputImageProps, InputFormFieldProps } from "@components/common/Input"
import { useInput, useState } from "@utils/hooks"
import { useTrueClick } from "@utils/hooks/useTrueClick"
import SearchRounded from "@mui/icons-material/SearchRounded"
import HideImageRounded from "@mui/icons-material/HideImageRounded"
import VisibilityRounded from "@mui/icons-material/VisibilityRounded"
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded"
import { Button } from "@components/common/Button"

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
                style={props.style || undefined}
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
                style={props.style || undefined}
                onChange={(e) => props.onChange?.(e.target.value)}
            />
        )
    }

    export function Image(props: InputImageProps) {
        const input = useInput({ handler: props.onChange })
        
        const trueClick = useTrueClick(() => {
            if (props.disabled) return
            input.click()
        })

        let className = cl + " input-component-image"
        if (!props.imageURL) className += " input-component-image__empty"
        if (props.disabled) className += " input-component-image__disabled"

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

    export function FormField(props: InputFormFieldProps) {
        const passwordVisible = useState(false)

        let className = cl + " input-component-form-field"
        if (props.fullWidth) className += " " + (cl + "__full-width")

        let type = "text"
        if (passwordVisible.value) type = "text"
        else if (props.email) type = "email"
        else if (props.password) type = "password"

        let bottomClassName = "bottom"
        if (props.password) bottomClassName += " bottom__password"

        return (
            <div className={className}>
                <div className="top">
                    <div className="label" children={props.label} />
                    
                    {Boolean(props.subLabel) && (
                        <Button.Text
                            value={props.subLabel!}
                            onClick={props.onSubLabelClick}
                        />
                    )}
                </div>

                <div className={bottomClassName}>
                    <input
                        type={type}
                        title={props.value || undefined}
                        spellCheck={false}
                        value={props.value || undefined}
                        placeholder={props.placeholder ?? undefined}
                        defaultValue={props.defaultValue || undefined}
                        onChange={(e) => props.onChange?.(e.target.value)}
                        autoComplete={props.autoComplete ?? undefined}
                    />

                    {props.password && (
                        <Button.Icon
                            icon={passwordVisible.value ? VisibilityOffRounded : VisibilityRounded}
                            onClick={() => passwordVisible.invert()}
                        />
                    )}
                </div>
            </div>
        )
    }
}