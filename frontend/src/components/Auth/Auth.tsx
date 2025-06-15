import { FormEvent } from "react"
import "./Auth.style.scss"
import { useStorage } from "@utils/hooks/useStorage"
import axios from "axios"

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
            localStorage.setItem("token", res.data)
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

    const handleModeChange = () => {
        isSignIn.invert()
        let slide = new Audio("slide.mp3")
        slide.volume = 0.1
        slide.play()
    }

    return (
        <div className="signFormBox">
            <div className="signBox" style={{ translate: !isSignIn.value ? "-60%" : "0" }}>
                <form className={"signInBox"} onSubmit={onSubmit}>
                    <div className="title">Sign In</div>
                    <div className="signInputs">
                        <input type="text" name="login" placeholder="Email or Login" />
                        <input type="password" name="password" placeholder="Password" />
                    </div>
                    <a>Forgot password?</a>
                    <button
                        className="formSubmitButton"
                        type="submit"
                        children={"Sign In"}
                    />
                </form>

                <div className="modeBox" onClick={() => handleModeChange()}>
                    {isSignIn.value ? 'Sign Up' : 'Sign In'}
                </div>

                <form className={"signUpBox"} onSubmit={onSubmit}>
                    <div className="title">Sign Up</div>
                    <div className="signInputs">
                        <input type="email" name="email" placeholder="Email" />
                        <input type="text" name="login" placeholder="Login" />
                        <input type="password" name="password" placeholder="Password" />
                    </div>
                    <button
                        className="formSubmitButton"
                        type="submit"
                        children={"Sign Up"}
                    />
                </form>
            </div>
        </div>
    )
}