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

interface SignData {
    email: string
    login: string
    password: string
}

type AuthMode =
    | "signin"
    | "signup"

export function Auth() {
    const mode = useState<AuthMode>("signin")
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

    return (
        <div className="auth-page-component">
            <div className="container">
                <ParallaxBackground imageURL={BackgroundURL} />

                <form>
                    <div
                        className="row row-title"
                        children="Music Vault"
                    />

                    <div className="row">
                        Sign In / Sign Up

                        <HelpOutlineRounded />
                    </div>
                    {/* {mode.value === "signin" && (

                    )} */}
                </form>
            </div>

            <div className="footer">
                <div className="item">terms</div>

                <Divider />

                <div className="item">report</div>
                
                <Divider />
                
                <div className="item">credits</div>
            </div>
        </div>
    )
}