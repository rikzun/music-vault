import { FormEvent } from "react"
import "./Auth.style.scss"
import { useStorage } from "@utils/hooks/useStorage"
import axios from "axios"
import { ClassName } from "@utils/components/ClassName"

interface SignData {
    email: string
    login: string
    password: string
}

export function Auth() {
    const isSignIn = useStorage<boolean>(true)

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData.entries()) as unknown as SignData

        const handler = isSignIn.value ? signInHandler : signUpHandler
        handler(formJson)
    }

    const signInHandler = (data: SignData) => {
        axios.post<string>("sign-in", data).then((res) => {
            console.log(res)
        }).catch((reason) => {
            console.log(reason)
        })
    }

    const signUpHandler = (data: SignData) => {
        axios.post<string>("sign-up", data).then((res) => {
            console.log(res)
        }).catch((reason) => {
            console.log(reason)
        })
    }

    return (
        <form className="signFormBox" onSubmit={onSubmit}>
            <div className="signBox">
                <div className="modeBar">
                    <ClassName signModeActive={isSignIn.value}>
                        <button
                            className="modeButton"
                            children="Sign In"
                            onClick={() => !isSignIn.value && isSignIn.invert()}
                        />
                    </ClassName>

                    <ClassName signModeActive={!isSignIn.value}>
                        <button
                            className="modeButton"
                            children="Sign Up"
                            onClick={() => isSignIn.value && isSignIn.invert()}
                        />
                    </ClassName>
                </div>

                <div className="inputBox">
                    {isSignIn.value
                        ? (
                            <div className="signInputs">
                                <input type="text" name="login" placeholder="Email or Login" />
                                <input type="password" name="password" placeholder="Password" />
                            </div>
                        )
                        : (
                            <div className="signInputs">
                                <input type="email" name="email" placeholder="Email" />
                                <input type="text" name="login" placeholder="Login" />
                                <input type="password" name="password" placeholder="Password" />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="submitButtonBox">
                <button
                    className="formSubmitButton"
                    type="submit"
                    children={isSignIn.value ? "SIGN IN" : "SIGN UP"}
                />
            </div>
        </form>
    )
}