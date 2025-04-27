import { FormEvent, FormEventHandler, useCallback } from 'react'
import './Auth.style.scss'
import { useStorage } from "src/utils"
import axios, { AxiosError, AxiosResponse } from 'axios'

class SignData {
    email: string = ""
    login: string = ""
    password: string = ""
}

export function Auth() {
    const isSignIn = useStorage<boolean>(true)

    const handleLogin = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const formJson = Object.fromEntries(formData.entries()) as unknown as SignData
        console.log(formJson);

        (isSignIn.value ? axios.post<string>("sign-in", formJson) : axios.post<string>("sign-up", formJson)).then((response) => {
            if (response.status === 200) localStorage.setItem("token", response.data)
        })
        .catch((reason) => {
            console.error(reason)
        })
    }, [isSignIn])

    return <form className='signFormBox' onSubmit={handleLogin}>
        <div className='signBox'>
            <div className='modeBar'>
                <button className={'modeButton' + (isSignIn.value ? ' signModeActive' : '')} onClick={() => !isSignIn.value && isSignIn.invert()}>Sign In</button>
                <button className={'modeButton' + (!isSignIn.value ? ' signModeActive' : '')}  onClick={() => isSignIn.value && isSignIn.invert()}>Sign Up</button>
            </div>
            <div className='inputBox'>
                {isSignIn.value && <div className='signInputs'>
                    <input required type='email' name='login' placeholder="Email or Login"></input>
                    <input required type='password' name='password' placeholder="Password"></input>
                </div>}

                {!isSignIn.value && <div className='signInputs'>
                    <input required type='email' name='email' placeholder="Email"></input>
                    <input required type='text' name='login' placeholder="Login"></input>
                    <input required type='password' name='password' placeholder="Password"></input>
                </div>}
            </div>
        </div>
        <div className='submitButtonBox'>
            <button className='formSubmitButton' type="submit">{isSignIn.value ? "SIGN IN" : "SIGN UP"}</button>
        </div>
    </form>
}
