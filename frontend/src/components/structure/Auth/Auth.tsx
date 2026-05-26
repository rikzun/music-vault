import "./Auth.style.scss"
import axios from "axios"
import { useState } from "@utils/hooks"
import { SettingsAtoms } from "src/atoms/settings"
import { SignResponse } from "src/types/types"
import { LocalStorage } from "@utils/localStorage"
import { ReactEvent } from "@utils/react"
import { Divider } from "@components/common/Divider"
import { ParallaxBackground } from "@components/common/ParallaxBackground"
import BackgroundURL from "@assets/auth-background.jpg?url"
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded"
import { Input } from "@components/common/Input"
import { Button } from "@components/common/Button"
import { Switch } from "@components/common/Switch"

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

    const onSubmit = (e: ReactEvent.Submit<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.target)

        if (isSignIn) onSignIn(formData)
        else onSignUp(formData)
    }

    const onSignIn = (formData: FormData) => {
        const identifier = formData.get("identifier")
        const password = formData.get("password")

        const data = { identifier, password }

        axios.post<SignResponse>("auth/sign-in", data).then((res) => {
            LocalStorage.setString("token", res.data.token)
            tokenAtom.set(res.data.token)
            axios.defaults.headers["Authorization"] = res.data.token
        }).catch((reason) => {
            console.log(reason)
        })
    }
    
    const onSignUp = (formData: FormData) => {
        const email = formData.get("email")
        const login = formData.get("login")
        const password = formData.get("password")

        const data = { email, login, password }

        axios.post<SignResponse>("auth/sign-up", data).then((res) => {
            LocalStorage.setString("token", res.data.token)
            tokenAtom.set(res.data.token)
            axios.defaults.headers["Authorization"] = res.data.token
        }).catch((reason) => {
            console.log(reason)
        })
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
                        <Switch.Container>
                            <Switch.Option label="Sign In" onSelect={() => mode.set("sign-in")} active={mode.value == "sign-in"} />
                            <Switch.Option label="Sign Up" onSelect={() => mode.set("sign-up")} active={mode.value == "sign-up"} />
                        </Switch.Container>

                        {/* <HelpOutlineRounded /> */}
                    </div>

                    {isSignIn && (
                        <>
                            <Input.FormField
                                name="identifier"
                                label="Identifier"
                                placeholder="email or login"
                                autoComplete="on"
                            />

                            <Input.FormField
                                name="password"
                                label="Password"
                                placeholder="••••••••"

                                subLabel="Forgot password?"
                                autoComplete="current-password"
                                password
                                minLength={8}
                            />

                            <Button.Small value="SIGN IN" fullWidth />
                        </>
                    )}
                    
                    {isSignUp && (
                        <>
                            <Input.FormField
                                name="email"
                                label="Email"
                                placeholder="example@gmail.com"
                                autoComplete="on"
                            />

                            <Input.FormField
                                name="login"
                                label="Login"
                                placeholder="rikzun"
                            />

                            <Input.FormField
                                name="password"
                                label="Password"
                                placeholder="••••••••"

                                autoComplete="current-password"
                                password
                                minLength={8}
                            />

                            <Button.Small value="SIGN UP" fullWidth />
                        </>
                    )}
                </form>
            </div>

            <div className="footer">
                <Button.Text value="TERMS" />
                <Divider size="small" />
                <Button.Text value="REPORT" />
                <Divider size="small" />
                <Button.Text value="CREDITS" />
            </div>
        </div>
    )
}