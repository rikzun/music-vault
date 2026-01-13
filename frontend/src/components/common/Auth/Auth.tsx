import "./Auth.style.scss"
import axios from "axios"
import { FormEvent } from "react"
import { useState } from "@utils/hooks"
import { SettingsAtoms } from "src/atoms/settings"
import slideAudioUrl from "@assets/slide.mp3?url"
import { SignResponse } from "src/types/types"
import { LocalStorage } from "@utils/localStorage"

interface SignData {
    email: string
    login: string
    password: string
}

export function Auth() {
    const isSignIn = useState<boolean>(true)
    const tokenAtom = SettingsAtoms.useToken()

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData.entries()) as unknown as SignData

        const handler = isSignIn.value ? signInHandler : signUpHandler
        handler(formJson)
    }

    const signInHandler = (data: SignData) => {
        axios.post<SignResponse>("auth/sign-in", data).then((res) => {
            console.log(res)
            LocalStorage.setString("token", res.data.token)
            tokenAtom.set(res.data.token)
            axios.defaults.headers["Authorization"] = res.data.token
        }).catch((reason) => {
            console.log(reason)
        })
    }

    const signUpHandler = (data: SignData) => {
        axios.post<SignResponse>("auth/sign-up", data).then((res) => {
            console.log(res)
            LocalStorage.setString("token", res.data.token)
            tokenAtom.set(res.data.token)
            axios.defaults.headers["Authorization"] = res.data.token
        }).catch((reason) => {
            console.log(reason)
        })
    }

    const handleModeChange = () => {
        isSignIn.invert()
        let slide = new Audio(slideAudioUrl)
        slide.volume = 0.1
        slide.play()
    }

    return (
        <div className="signFormBox">
            <div className="signBox" style={{ translate: !isSignIn.value ? "-60%" : "0" }}>
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