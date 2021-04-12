import Link from "next/link"
import styles from "../styles/app.module.scss"
import LogInStyles from "../styles/components.LogInForm.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus, faUser } from '@fortawesome/free-solid-svg-icons'
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Row } from ".prisma/client"
import Loading from "../components/loading"
import RowComponent from "../components/row"
import { HEADERS } from "../constants/consts"
import useUser from "../components/hooks/useUser"
import { User } from "@prisma/client"
import useWBOL from "../components/hooks/useWBOL"
import Head from "next/head"

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
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div>
                            <div>
                                Site
                            </div>
                        </div>
                        <div>
                            <div>
                                Name
                            </div>
                        </div>
                        <div>
                            <div>
                                Password
                            </div>
                        </div>
                    </div>
                    <div className={styles.rows}>
                        {rows ?
                            (rows as Row[]).sort((a: Row, b: Row) =>
                                a.site.toLowerCase() > b.site.toLowerCase() ? 1 : -1
                            ).filter((v: Row) =>
                                v.site.includes(inputVal) ||
                                v.email.includes(inputVal) ||
                                v.username?.includes(inputVal)
                            ).map((row: Row, i) =>
                                <RowComponent {...row} key={i} />
                            )
                            : <Loading />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App