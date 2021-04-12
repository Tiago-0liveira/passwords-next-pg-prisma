import Link from "next/link"
import styles from "../styles/app.module.scss"
import LogInStyles from "../styles/components.LogInForm.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus, faUser } from '@fortawesome/free-solid-svg-icons'
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { HEADERS } from "../constants/consts"
import useUser from "../components/hooks/useUser"
import { User, Row } from "@prisma/client"
import useWBOL from "../components/hooks/useWBOL"
import Head from "next/head"
import RowsOld from "../components/RowsOld"


const App = () => {
    const [user] = useUser()
    const [rows, setRows] = useState<false | Row[]>(false)
    const [inputVal, setinputVal] = useState("")
    const [, setWBOL] = useWBOL();

    useEffect(() => {
        user && fetch("/api/row", {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({
                type: "get",
                userId: (user as User).id
            })
        }).then(res => res.json()).then((data: Row[]) => {
            if (data) {
                setRows(data)
            } else {
                console.log("app.tsx|33|: Data podre")
            }
        })
    }, [user]);

    return (
        <div className={[styles.Wrapper].join(" ")}>
            <Head>
                <title>Main App</title>
            </Head>
            <nav className={[styles.nav].join(" ")}>
                <div className={styles.navLeft}>
                    <Link href="/" >
                        <button className={[LogInStyles.button, styles.buttonBack].join(" ")} onClick={() => {
                            (setWBOL as Dispatch<SetStateAction<boolean>>)(true)
                        }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        Back
                    </button>
                    </Link>
                    <button className={[LogInStyles.button, styles.buttonNewRow].join(" ")}>
                        <FontAwesomeIcon icon={faPlus} />
                        New Row
                    </button>
                </div>
                <div className={styles.navMiddle}>
                    <div className={styles.inputWrapper}>
                        <input type="text" placeholder="Search" autoFocus onLoad={(e) => { console.log(e) }} onChange={(e) => setinputVal(e.target.value)} />
                    </div>
                </div>
                <div className={styles.navRight}>
                    <button className={[LogInStyles.button, styles.buttonNewRow].join(" ")}>
                        <FontAwesomeIcon icon={faUser} />
                        {user?.username}
                    </button>
                </div>
            </nav>
            <div className={[styles.wrapper, styles.flex].join(" ")}>
                <RowsOld rows={rows} inputVal={inputVal.toLowerCase()} />
            </div>
        </div>
    )
}

export default App