import { faEnvelope, faEye, faEyeSlash, faGlobeEurope, faLink, faLock, faUser } from "@fortawesome/free-solid-svg-icons"
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormEvent, useState } from "react"
import { ModalNewRowData, ModalProps } from "../@types/types"
import { HEADERS, LogInPlatformIconColors, LogInPlatforms, ModalEventName, ModalType, RowPostType } from "../constants/consts"
import styles from "../styles/component.modal.module.scss"
import clsx from "clsx"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"

const Modal = ({ setModalData, type, isOpen, onConfirm, data, notificationManager, extraData }: ModalProps) => {
    const [LogInWithPlatForm, setLogInWithPlatForm] = useState<boolean>(false)
    const [passwordShow, setPasswordShow] = useState<boolean>(false)
    const [Site, setsite] = useState<string>("")
    const [Email, setemail] = useState<string>("")
    const [LogInPlatform, setLogInPlatform] = useState<string>("")
    const [Username, setusername] = useState<string>("")
    const [Password, setpassword] = useState<string>("")


    const submitConfirmation = () => {
        onConfirm()
        setModalData(prevData => { return { ...prevData, isOpen: false } })
    }
    const submitNew = () => {
        if (Site && Email) {
            if (LogInWithPlatForm) {
                if (!LogInPlatform) return notificationManager.error("Log In Platform Invalid")
            } else {
                if (!Username) return notificationManager.error("Username Invalid")
                if (!Password) return notificationManager.error("Password Invalid")
            }
            const sendData: ModalNewRowData = {
                site: Site,
                email: Email,
                ...LogInWithPlatForm ? {
                    logInWithPlatform: LogInPlatform
                } : {
                    username: Username, password: Password
                }
            };
            fetch("/api/row", {
                method: "POST",
                headers: HEADERS,
                body: JSON.stringify({
                    type: RowPostType.create,
                    data: { ...sendData, userId: extraData.userId }
                })
            }).then(res => res.json()).then(data => {
                if (data.success) {
                    console.log(`modal.tsx|43|:->${JSON.stringify(data.row)} added with success`)
                    onConfirm(data.row)
                    notificationManager.success("Successfully Added!")
                    setModalData(prevData => { return { ...prevData, isOpen: false } })
                } else {
                    notificationManager.error(JSON.stringify(data.error), "Error:")
                    console.error(data.error)
                }
            })
        } else {
            if (!Site) return notificationManager.error("Site Invalid")
            if (!Email) return notificationManager.error("Email Invalid")
        }

    }
    const Cancel = () => {
        setModalData(prevData => { return { ...prevData, isOpen: false } })
    }
    const submitForm = (e: FormEvent) => {
        e.preventDefault()
        const submitter: HTMLButtonElement = e.nativeEvent.submitter
        console.log(submitter.name)
        switch (submitter.name) {
            case ModalEventName.Confirm:
                return type === ModalType.Confirmation ? submitConfirmation() : submitNew()
            case ModalEventName.Cancel:
                return Cancel()
            default:
                console.error("FORM SHOULD HAVE A TYPE!!")
                return console.error("EXECUTING DEFAULT HANDLER")
        }
    }
    return (
        <div className={clsx(isOpen ? styles.Open : styles.Close, styles.modal)}>
            {type === ModalType.Confirmation ?
                <form
                    onSubmit={submitForm}
                    className={clsx(styles.ConfirmationForm)}
                >
                    <div className={styles.top}>
                        <h1>Confirm ?</h1>
                    </div>

                    <div className={styles.buttons}>
                        <button name={ModalEventName.Confirm} onClick={submitConfirmation} className={clsx(styles.button, styles.buttonConfirm)}>Confirm</button>
                        <button name={ModalEventName.Cancel} onClick={Cancel} className={clsx(styles.button, styles.buttonCancel)}>Cancel</button>
                    </div>
                </form >

                :
                <form
                    onSubmit={submitForm}
                    className={clsx(styles.NewForm)}
                >

                    <div className={styles.top}>
                        <h1>Create new Row</h1>
                    </div>
                    <div className={styles.content}>

                        <div className={styles.inputDiv}>
                            <label htmlFor="site" ><FontAwesomeIcon icon={faGlobeEurope} size={"lg"} /> Site Name</label>
                            <input onChange={(e) => { setsite(e.target.value) }} type="site" className={clsx(styles.SiteInput, styles.input)} list="sites" />
                            <datalist id="sites">
                                {data?.sites && data.sites.map(
                                    (site, i) => <option key={i} value={site} />
                                )}
                            </datalist>
                        </div>

                        <div className={styles.inputDiv}>
                            <label htmlFor="email" ><FontAwesomeIcon icon={faEnvelope} size={"lg"} /> Email</label>
                            <input onChange={(e) => { setemail(e.target.value) }} type="email" className={clsx(styles.emailInput, styles.input)} list="emails" />
                            <datalist id="emails">
                                {data?.emails && data.emails.map(
                                    (email, i) => <option key={i} value={email} />
                                )}
                            </datalist>
                        </div>

                        {LogInWithPlatForm ?
                            <>
                                <div className={clsx(styles.inputDiv, styles.inputDivPassword, styles.LogInPlatformDiv)}>
                                    <label htmlFor="LogInPlatform" ><FontAwesomeIcon icon={faLink} size={"lg"} /> Log In With Platform ?</label>
                                    <button disabled>
                                        <FontAwesomeIcon icon={LogInPlatforms.find(({ value }) =>
                                            value === LogInPlatform
                                        )?.icon || faGoogle} size="lg" color={LogInPlatformIconColors[LogInPlatform] || "white"} />
                                    </button>
                                    <select
                                        onChange={(e) => { setLogInPlatform(e.target.value) }}
                                        className={clsx(styles.LogInPlatFormsInput, styles.input)}
                                        name="LogInPlatform"
                                    >
                                        <option value="" disabled hidden className={styles.defaultOption}>Log In Platform</option>
                                        {LogInPlatforms.map(
                                            ({ value }, i) => <option key={i} value={value} >{value}</option>
                                        )}
                                    </select>
                                </div>
                            </> : <></>}

                        {!LogInWithPlatForm ? <>
                            <div className={styles.inputDiv}>
                                <label htmlFor="username" ><FontAwesomeIcon icon={faUser} size={"lg"} /> Username</label>
                                <input
                                    onChange={(e) => { setusername(e.target.value) }}
                                    type="text"
                                    className={clsx(styles.usernameInput, styles.input)}
                                    name="username"
                                    list="usernames"
                                />
                                <datalist id="usernames">
                                    {data?.usernames && data.usernames.map(
                                        (username, i) => <option key={i} value={username} />
                                    )}
                                </datalist>
                            </div>

                            <div className={clsx(styles.inputDiv, styles.inputDivPassword)}>
                                <label htmlFor="password" ><FontAwesomeIcon icon={faLock} size={"lg"} /> Password</label>
                                <input onChange={(e) => { setpassword(e.target.value) }} type={passwordShow ? "text" : "password"} className={clsx(styles.passwordInput, styles.input)} />
                                <button onClick={(e) => { e.preventDefault(); setPasswordShow(prevVal => !prevVal) }}><FontAwesomeIcon icon={passwordShow ? faEye : faEyeSlash} /></button>
                            </div> </> : <></>}

                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.leftButton}>
                            <div onClick={() => { setLogInWithPlatForm(prevVal => !prevVal) }}>
                                <FontAwesomeIcon icon={LogInWithPlatForm ? faCheckSquare : faSquare} color={LogInWithPlatForm ? "#ecb900" : "red"} />
                                <label >Log In With Platform ?</label>
                            </div>
                        </div>
                        <div className={styles.buttons}>
                            <button name={ModalEventName.Confirm} className={clsx(styles.button, styles.buttonConfirm)}>Confirm</button>
                            <button name={ModalEventName.Cancel} className={clsx(styles.button, styles.buttonCancel)}>Cancel</button>
                        </div>
                    </div>
                </form>
            }
        </div >
    )
}

export default Modal