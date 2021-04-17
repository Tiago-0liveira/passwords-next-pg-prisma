import { faEnvelope, faEye, faEyeSlash, faGlobeEurope, faLink, faLock, faUser } from "@fortawesome/free-solid-svg-icons"
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FormEvent, useEffect, useReducer } from "react"
import { ModalNewRowData, ModalNewRowDataWithoutLogin, ModalNewRowDataWithLogin, ModalProps, ModalUseReducerAction, ModalReducerState, IModalDataUpdateWithLogIn, IModalDataUpdateWithoutLogIn } from "../@types/types"
import { LogInPlatformIconColors, LogInPlatforms, ModalEventName, ModalType, ModalActionType } from "../constants/consts"
import styles from "../styles/component.modal.module.scss"
import clsx from "clsx"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { NotificationManager } from 'react-notifications';
import { LogInPlatform } from ".prisma/client"

const reducerInitVal: ModalReducerState = {
    Site: "",
    Email: "",
    LogInPlatform: LogInPlatform.Google,
    Username: "",
    Password: "",
    LogInWithPlatForm: false,
    passwordShow: false
}
function reducer(state: ModalReducerState, action: ModalUseReducerAction) {
    switch (action.type) {
        case ModalActionType.UpWiPlatform:
            return {
                ...state,
                LogInWithPlatForm: true,
                LogInPlatform: action.payload.logInWithPlatform,
                Email: action.payload.email,
                Site: action.payload.site,
            }
        case ModalActionType.UpWoPlatform:
            return {
                ...state,
                LogInWithPlatForm: false,
                Email: action.payload.email,
                Site: action.payload.site,
                Username: action.payload.username,
                Password: action.payload.password,
            }
        case ModalActionType.setSite:
            return { ...state, Site: action.payload.Site }
        case ModalActionType.setEmail:
            return { ...state, Email: action.payload.Email }
        case ModalActionType.setLogInPlatform:
            switch (action.payload.LogInPlatform) {
                case LogInPlatform.Discord:
                    return { ...state, LogInPlatform: LogInPlatform.Discord }
                case LogInPlatform.Facebook:
                    return { ...state, LogInPlatform: LogInPlatform.Facebook }
                case LogInPlatform.Git:
                    return { ...state, LogInPlatform: LogInPlatform.Git }
                case LogInPlatform.Reddit:
                    return { ...state, LogInPlatform: LogInPlatform.Reddit }
                default:
                    return { ...state, LogInPlatform: LogInPlatform.Google }
            }
        case ModalActionType.setUsername:
            return { ...state, Username: action.payload.Username }
        case ModalActionType.setPassword:
            return { ...state, Password: action.payload.Password }
        case ModalActionType.TogglePassword:
            return { ...state, passwordShow: !state.passwordShow }
        case ModalActionType.ToggleLogInWithPlatform:
            return { ...state, LogInWithPlatForm: !state.LogInWithPlatForm }
        case ModalActionType.Reset:
            return reducerInitVal
        default:
            throw new Error();
    }
}
const Modal = ({ setModalData, ModalData: { type, update, isOpen, onConfirm, data } }: ModalProps) => {
    const [{ Site,
        Email,
        LogInPlatform,
        Username,
        Password,
        LogInWithPlatForm,
        passwordShow
    }, dispatch] = useReducer(reducer, reducerInitVal)

    useEffect(() => {
        if (update) {
            if ((update as IModalDataUpdateWithLogIn).logInWithPlatform) {
                const tupdate = update as IModalDataUpdateWithLogIn
                dispatch({
                    type: ModalActionType.UpWiPlatform,
                    payload: {
                        email: update.email,
                        logInWithPlatform: tupdate.logInWithPlatform,
                        site: update.site
                    }
                })
            } else {
                const tupdate = update as IModalDataUpdateWithoutLogIn
                dispatch({
                    type: ModalActionType.UpWoPlatform,
                    payload: {
                        email: update.email,
                        site: update.site,
                        username: tupdate.username,
                        password: tupdate.password
                    }
                })
            }
        }
    }, []);
    const submitConfirmation = () => {
        onConfirm()
        setModalData(prevData => { return { ...prevData, isOpen: false } })
    }

    const submitNew = () => {
        if (update) {
            if (!Site) return NotificationManager.error("Site Can't be Empty")
            if (!Email) return NotificationManager.error("Email Can't be Empty")
            if (LogInWithPlatForm) {
                if (!LogInPlatform) return NotificationManager.error("Log In Platform Invalid")
            } else {
                if (!Password) return NotificationManager.error("Password Invalid")
            }
            if (Email === update.email && Site === update.site) {
                if (LogInWithPlatForm && LogInPlatform
                    === (update as IModalDataUpdateWithLogIn).logInWithPlatform) {
                    return NotificationManager.error("I Think u wanted to change some values..?")
                } else {
                    const tupdate = update as IModalDataUpdateWithoutLogIn
                    if (Password === tupdate.password && Username === tupdate.username) {
                        return NotificationManager.error("I Think u wanted to change some values..?")
                    }
                }
            }
            if (Object.keys(update).includes("logInWithPlatform")) {
                onConfirm({
                    site: Site,
                    email: Email,
                    logInWithPlatform: LogInPlatform
                })

            } else {
                onConfirm({
                    site: Site,
                    email: Email,
                    password: Password,
                    ...Username && { username: Username }
                })

            }

        }
        else if (Site && Email) {
            if (LogInWithPlatForm) {
                if (!LogInPlatform) return NotificationManager.error("Log In Platform Can't be Empty")
            } else {
                if (!Username) return NotificationManager.error("Username Can't be Empty")
                if (!Password) return NotificationManager.error("Password Can't be Empty")
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
            onConfirm(sendData)
        } else {
            if (!Site) return NotificationManager.error("Site Invalid")
            if (!Email) return NotificationManager.error("Email Invalid")
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
                        <h1>{update ? "Update Row" : "Create new Row"}</h1>
                    </div>
                    <div className={styles.content}>

                        <div className={styles.inputDiv}>
                            <label htmlFor="site" ><FontAwesomeIcon icon={faGlobeEurope} size={"lg"} /> Site Name</label>
                            <input defaultValue={update ? update.site : ""} onChange={(e) => {
                                dispatch({
                                    type: ModalActionType.setSite, payload: { Site: e.target.value }
                                })
                            }} type="site" className={clsx(styles.SiteInput, styles.input)} list="sites" />
                            <datalist id="sites">
                                {data?.sites && data.sites.map(
                                    (site, i) => <option key={i} value={site} />
                                )}
                            </datalist>
                        </div>

                        <div className={styles.inputDiv}>
                            <label htmlFor="email" ><FontAwesomeIcon icon={faEnvelope} size={"lg"} /> Email</label>
                            <input defaultValue={update ? update.email : ""} onChange={(e) => {
                                dispatch({
                                    type: ModalActionType.setEmail, payload: { Email: e.target.value }
                                })
                            }} type="email" className={clsx(styles.emailInput, styles.input)} list="emails" />
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
                                        )?.icon || faGoogle} size="lg" color={LogInPlatform ? LogInPlatformIconColors[LogInPlatform] : LogInPlatformIconColors["Google"]} />
                                    </button>
                                    <select
                                        onChange={(e) => {
                                            dispatch({
                                                type: ModalActionType.setLogInPlatform, payload: { LogInPlatform: e.target.value }
                                            })
                                        }}
                                        className={clsx(styles.LogInPlatFormsInput, styles.input)}
                                        name="LogInPlatform"
                                    >
                                        {LogInPlatforms.map(
                                            ({ value }, i) =>
                                                <option key={i} value={value}
                                                    selected={update && (value as string) === (update as ModalNewRowDataWithLogin).logInWithPlatform}
                                                >
                                                    {value}
                                                </option>

                                        )}
                                    </select>
                                </div>
                            </> : <></>}

                        {!LogInWithPlatForm && <>
                            {(!update || (update && (update as ModalNewRowDataWithoutLogin).username)) &&
                                <div className={styles.inputDiv}>
                                    <label htmlFor="username" ><FontAwesomeIcon icon={faUser} size={"lg"} /> Username</label>
                                    <input
                                        onChange={(e) => {
                                            dispatch({
                                                type: ModalActionType.setUsername, payload: { Username: e.target.value }
                                            })
                                        }}
                                        type="text"
                                        className={clsx(styles.usernameInput, styles.input)}
                                        name="username"
                                        list="usernames"
                                        defaultValue={update ? (update as ModalNewRowDataWithoutLogin).username : ""}
                                    />
                                    <datalist id="usernames">
                                        {data?.usernames && data.usernames.map(
                                            (username, i) => <option key={i} value={username} />
                                        )}
                                    </datalist>
                                </div>}

                            <div className={clsx(styles.inputDiv, styles.inputDivPassword)}>
                                <label htmlFor="password" ><FontAwesomeIcon icon={faLock} size={"lg"} /> Password</label>
                                <input
                                    onChange={(e) => {
                                        dispatch({
                                            type: ModalActionType.setPassword, payload: { Password: e.target.value }
                                        })
                                    }}
                                    type={passwordShow ? "text" : "password"}
                                    className={clsx(styles.passwordInput, styles.input)}
                                    defaultValue={update ? (update as ModalNewRowDataWithoutLogin).password : ""}
                                />
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    dispatch({
                                        type: ModalActionType.TogglePassword
                                    })
                                }}><FontAwesomeIcon icon={passwordShow ? faEye : faEyeSlash} /></button>
                            </div> </>}

                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.leftButton}>
                            {!update &&
                                <div onClick={() => {
                                    dispatch({
                                        type: ModalActionType.ToggleLogInWithPlatform
                                    })
                                }}>
                                    <FontAwesomeIcon icon={LogInWithPlatForm ? faCheckSquare : faSquare} color={LogInWithPlatForm ? "#ecb900" : "red"} />
                                    <label >Log In With Platform ?</label>
                                </div>}
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