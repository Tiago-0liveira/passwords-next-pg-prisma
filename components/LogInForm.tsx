import Head from "next/head"
import Link from "next/link"
import useUser from "../components/hooks/useUser"
import styles from "../styles/components.LogInForm.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser, faCalendarAlt, faIdCard } from '@fortawesome/free-solid-svg-icons'
import { User } from "@prisma/client"
import { useState } from "react"
import getFormatedDate from "../helpers/getFormatedDate"

enum State {
    LogIn,
    SignIn,
    App
}

export default function LogInForm() {
    let [user, loading, setUser] = useUser();
    const [state, setState] = useState<State>(State.LogIn)
    const [Username, setUsername] = useState("")
    const [Password, setPassword] = useState("")
    const submitLogInForm = () => {
        fetch("/api/user", {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                type: "auth",
                username: Username,
                password: Password,
            })
        }).then((res) => res.json()).then((data) => {
            if (data.success) {
                setUser(data.user)
                document.cookie = JSON.stringify({ token: data.token })
            }
            setUsername("")
            setPassword("")
        })
    }
    const submitSignInForm = () => {
        fetch("/api/user", {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                type: "create",
                username: Username,
                password: Password,
            })
        }).then((res) => res.json()).then((data) => {
            if (data.user !== undefined) {
                setUser(data.user)
                document.cookie = JSON.stringify({ token: data.user.loginToken })
                setState(State.LogIn)
            }
            setUsername("")
            setPassword("")
        })
    }
    const LogOut = () => {
        fetch("/api/user", {
            method: "POST", headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                type: "logOut",
                id: (user as User).id
            })
        }).then(res => res.json()).then(data => data)
        setUser(undefined)
        document.cookie = JSON.stringify("")
    }

    if (user) {
        return (
            <div className={styles.LoggedInForm}>
                <Head><title>Log In</title></Head>
                <h1 className={styles.h1}>Logged In</h1>
                <div className={styles.content}>
                    <div className={styles.info}>
                        <p><FontAwesomeIcon icon={faUser} /> Username: {(user as User).username}</p>
                        <p><FontAwesomeIcon icon={faCalendarAlt} /> Created At: {getFormatedDate(new Date((user as User).createdAt))}</p>
                        <p><FontAwesomeIcon icon={faIdCard} /> Id: {(user as User).id}</p>
                    </div>
                    <div className={styles.buttons}>
                        <button className={[styles.button, styles.buttonLogOut].join(" ")} onClick={LogOut}>Log Out</button>

                        <Link href="/app">
                            <button className={[styles.button, styles.buttonShowApp].join(" ")} >
                                Show App
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    } else {
        const LogIn = state === State.LogIn

        return (
            <form className={styles.LogInForm} onSubmit={(e) => {
                e.preventDefault(); (LogIn ? submitLogInForm : submitSignInForm)()
            }}>
                <Head><title>{LogIn ? "Log In" : "Sign In"}</title></Head>
                <h1 className={styles.h1}>{LogIn ? "Log In" : "Sign In"}</h1>
                <div className={styles.content}>
                    <div className={styles.FormInput}>
                        <FontAwesomeIcon icon={faUser} size={"lg"} />
                        <input className={styles.input} value={Username} onChange={(e) => { setUsername(e.target.value) }} type="text" name="username" placeholder="Username" />
                    </div>
                    <div className={styles.FormInput}>
                        <FontAwesomeIcon icon={faLock} size={"lg"} />
                        <input className={styles.input} value={Password} onChange={(e) => { setPassword(e.target.value) }} type="password" name="password" placeholder="Password" />
                    </div>
                    <div className={styles.bottom}>
                        <span onClick={() => {
                            setState(LogIn ? State.SignIn : State.LogIn)
                        }}>{LogIn ? "I Don't yet have an account!" : "I Already have an account!"}</span><br />
                    </div>
                    <div className={styles.bottom2}>
                        <button className={styles.button}>{LogIn ? "Log In" : "Sign In"}</button>
                    </div>
                </div>
            </form>
        )
    }
}