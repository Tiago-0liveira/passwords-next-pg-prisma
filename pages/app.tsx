import Link from "next/link"
import styles from "../styles/app.module.scss"
import LogInStyles from "../styles/components.LogInForm.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus, faUser } from '@fortawesome/free-solid-svg-icons'
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { HEADERS, ModalType, RowPostType } from "../constants/consts"
import useUser from "../components/hooks/useUser"
import { User, Row, LogInPlatform } from "@prisma/client"
import useWBOL from "../components/hooks/useWBOL"
import Head from "next/head"
import RowsOld from "../components/RowsOld"
import Modal from "../components/modal"
import { IModalData, TModalData } from "../@types/types"
import clsx from "clsx"
import { NotificationContainer, NotificationManager } from 'react-notifications';

const App = () => {
    const [user] = useUser()
    const [rows, setRows] = useState<false | Row[]>(false)
    const [inputVal, setinputVal] = useState("")
    const [, setWBOL] = useWBOL();
    const [ModalData, setModalData] = useState<IModalData>({
        type: ModalType.New,
        isOpen: false
    })
    const [onConfirm, setOnConfirm] = useState<() => void>(() => addNewRow)
    const [selectedRows, setSelectedRows] = useState<HTMLDivElement>()



    function updateRows() {
        fetch("/api/row", {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({
                type: RowPostType.get,
                userId: (user as User).id
            })
        }).then(res => res.json()).then((data: Row[]) => {
            if (data) {
                setRows(data)
            } else {
                console.log("app.tsx|33|: Data podre")
            }
        })
    }

    function addNewRow(row: Row) {
        setRows(prevVal => { return [...(prevVal as Row[]), row] })
    }
    useEffect(() => {
        user && updateRows()
    }, [user]);

    useEffect(() => {
        if (rows) {
            let data: TModalData = { usernames: [], sites: [], emails: [] };
            rows.forEach(row => {
                if (row.username && !data.usernames.includes(row.username)) data.usernames.push(row.username)
                if (!data.sites.includes(row.site)) data.sites.push(row.site)
                if (!data.emails.includes(row.email)) data.emails.push(row.email)
            })
            setModalData(prevVal => { return { ...prevVal, data } })
        }

    }, [rows]);
    return (
        <div className={clsx(styles.Wrapper)}>
            <Head>
                <title>Main App</title>
            </Head>
            <Modal
                {...ModalData}
                setModalData={setModalData}
                notificationManager={NotificationManager}
                extraData={{ userId: user?.id }}
                onConfirm={onConfirm}
            />
            <nav className={clsx(styles.nav)}>
                <div className={clsx(styles.navLeft)}>
                    <Link href="/" >
                        <button className={clsx(LogInStyles.button, styles.buttonBack)} onClick={() => {
                            (setWBOL as Dispatch<SetStateAction<boolean>>)(true)
                        }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        Back
                    </button>
                    </Link>
                    <button className={clsx(LogInStyles.button, styles.buttonNewRow)} onClick={() => { setModalData(prevData => { return { ...prevData, isOpen: true } }) }}>
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
                    <button className={clsx(LogInStyles.button, styles.buttonNewRow)}>
                        <FontAwesomeIcon icon={faUser} />
                        {user?.username}
                    </button>
                </div>
            </nav>
            <div className={clsx(styles.wrapper, styles.flex)}>
                <RowsOld rows={rows} inputVal={inputVal.toLowerCase()} />
            </div>
            <NotificationContainer />
        </div>
    )
}

export default App