import "./Auth.style.scss"
import axios from "axios"
import { FormEvent } from "react"
import { useState } from "@utils/hooks"
import { useTokenAtom } from "src/atoms/settings"

interface SignData {
    email: string
    login: string
    password: string
}

export function Auth() {
    const isSignIn = useState<boolean>(true)
    const tokenAtom = useTokenAtom()

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData.entries()) as unknown as SignData

        const handler = isSignIn.value ? signInHandler : signUpHandler
        handler(formJson)
    }

    const signInHandler = (data: SignData) => {
        axios.post<string>('sign-in', data).then((res) => {
            localStorage.setItem('token', res.data)
            tokenAtom.set(res.data)
        }).catch((reason) => {
            console.log(reason)
        })
    }

    const signUpHandler = (data: SignData) => {
        axios.post<string>('sign-up', data).then((res) => {
            console.log(res)
        }).catch((reason) => {
            console.log(reason)
        })
    }

    const handleModeChange = () => {
        isSignIn.invert()
        let slide = new Audio('slide.mp3')
        slide.volume = 0.1
        slide.play()
    }

    return (
        <div className="signFormBox">
            <div className="signBox" style={{ translate: !isSignIn.value ? '-60%' : '0' }}>
                <form className="signInBox" onSubmit={onSubmit}>
                    <div className="title">Sign In</div>

                    <div className="signInputs">
                        <input type="text"     name="login"    placeholder="Email or Login" />
                        <input type="password" name="password" placeholder="Password" />
                    </div>

                    <a href="">Forgot password?</a>
                    
                    <button
                        className="formSubmitButton"
                        type="submit"
                        children="Sign In"
                    />
                </form>

                <div className="modeBox" onClick={handleModeChange}>
                    <span
                        className="mode"
                        children="Sign Up"
                        style={{opacity: isSignIn.value ? 1 : 0}}
                    />
                    <span
                        className="mode"
                        children="Sign In"
                        style={{opacity: isSignIn.value ? 0 : 1}}
                    />
                </div>

                <form className="signUpBox" onSubmit={onSubmit}>
                    <div className="title">Sign Up</div>

                    <div className="signInputs">
                        <input type="email"    name="email"    placeholder="Email" />
                        <input type="text"     name="login"    placeholder="Login" />
                        <input type="password" name="password" placeholder="Password" />
                    </div>

                    <button
                        className="formSubmitButton"
                        type="submit"
                        children="Sign Up"
                    />
                </form>
            </div>
        </div>
    )
}