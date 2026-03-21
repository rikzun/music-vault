import "./Auth.style.scss"
import axios from "axios"
import { useState } from "@utils/hooks"
import { SettingsAtoms } from "src/atoms/settings"
import { SignResponse } from "src/types/types"
import { LocalStorage } from "@utils/localStorage"
import { ReactEvent } from "@utils/react"
import { Divider } from "@components/common/Divider"
import { useEffect, useRef } from "react"
import { ParallaxBackground } from "@components/common/ParallaxBackground"
import BackgroundURL from "@assets/auth-background.jpg?url"
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded"
import { Input } from "@components/common/Input"
import { Button } from "@components/common/Button"

interface SignData {
    email: string
    login: string
    password: string
}

type AuthMode =
    | "sign-in"
    | "sign-up"

export function Auth() {
    const mode = useState<AuthMode>("sign-in")
    const isSignIn = mode.value === "sign-in"
    const isSignUp = mode.value === "sign-up"

    const tokenAtom = SettingsAtoms.useToken()

    // const onSubmit = (e: ReactEvent.Submit<HTMLFormElement>) => {
    //     e.preventDefault()

    //     const form = e.target as HTMLFormElement
    //     const formData = new FormData(form)
    //     const formJson = Object.fromEntries(formData.entries()) as unknown as SignData

    //     const handler = isSignIn.value ? signInHandler : signUpHandler
    //     handler(formJson)
    // }

    // const signInHandler = (data: SignData) => {
    //     axios.post<SignResponse>("auth/sign-in", data).then((res) => {
    //         console.log(res)
    //         LocalStorage.setString("token", res.data.token)
    //         tokenAtom.set(res.data.token)
    //         axios.defaults.headers["Authorization"] = res.data.token
    //     }).catch((reason) => {
    //         console.log(reason)
    //     })
    // }

    // const signUpHandler = (data: SignData) => {
    //     axios.post<SignResponse>("auth/sign-up", data).then((res) => {
    //         console.log(res)
    //         LocalStorage.setString("token", res.data.token)
    //         tokenAtom.set(res.data.token)
    //         axios.defaults.headers["Authorization"] = res.data.token
    //     }).catch((reason) => {
    //         console.log(reason)
    //     })
    // }

    const onSubmit = (e: ReactEvent.Submit<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div className="auth-page-component">
            <div className="container">
                <ParallaxBackground imageURL={BackgroundURL} />

                <form onSubmit={onSubmit}>
                    <div
                        className="title"
                        children="Music Vault"
                    />

                    <div className="change-mode">
                        Sign In / Sign Up

                        <HelpOutlineRounded />
                    </div>

                    {isSignIn && (
                        <>
                            <Input.FormField
                                label="Identifier"
                                placeholder="email or login"
                                autoComplete="on"
                                email
                            />

                            <Input.FormField
                                label="Password"
                                placeholder="••••••••"

                                subLabel="Forgot password?"
                                autoComplete="current-password"
                                password
                            />

                            <Button.Small value="SIGN IN" fullWidth />
                        </>
                    )}
                    
                    

                </form>
            </div>

            <div className="footer">
                <Button.Text value="TERMS" />
                <Divider />
                <Button.Text value="REPORT" />
                <Divider />
                <Button.Text value="CREDITS" />
            </div>
        </div>
    )
}