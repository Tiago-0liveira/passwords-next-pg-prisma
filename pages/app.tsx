import Link from "next/link"
import styles from "../styles/app.module.scss"
import LogInStyles from "../styles/components.LogInForm.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPencilAlt, faPlus, faTimes, faUser } from '@fortawesome/free-solid-svg-icons'
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { HEADERS, ModalType, RowPostType } from "../constants/consts"
import useUser from "../components/hooks/useUser"
import { User, Row, LogInPlatform } from "@prisma/client"
import useWBOL from "../components/hooks/useWBOL"
import Head from "next/head"
import RowsOld from "../components/RowsOld"
import Modal from "../components/modal"
import { IModalData, IModalDataBaseUpdate, IModalDataUpdateWithLogIn, IModalDataUpdateWithoutLogIn, ModalNewRowData, SelectedRow, TModalData } from "../@types/types"
import clsx from "clsx"
import { NotificationContainer, NotificationManager } from 'react-notifications';

const App = () => {
    const [user] = useUser()
    const [rows, setRows] = useState<false | Row[]>(false)
    const [inputVal, setinputVal] = useState("")
    const [, setWBOL] = useWBOL();
    const [ModalData, setModalData] = useState<IModalData>({
        type: ModalType.New,
        isOpen: false,
        onConfirm: addNewRow
    })
    const [selectedRows, setSelectedRows] = useState<SelectedRow[]>([])

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
                setRows([])
                setRows(data)
            } else {
                console.log("app.tsx|33|: Data podre")
            }
        })
    }
    function addNewRow(Modaldata: ModalNewRowData) {
        fetch("/api/row", {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify({
                type: RowPostType.create,
                data: { ...Modaldata, userId: user?.id }
            })
        }).then(res => res.json()).then(data => {
            if (data.success) {
                NotificationManager.success("Successfully Added!")
                setModalData(prevData => { return { ...prevData, isOpen: false } })
                setRows(prevVal => { return [...(prevVal as Row[]), data.row] })
            } else {
                NotificationManager.error(JSON.stringify(data.error), "Error:")
                console.error(data.error)
            }
        })
    }
    function submitUpdate(data: ModalNewRowData) {
        const uuid = selectedRows[0].uuid
        const rowToUpdate = selectedRows.find(val => val.uuid === uuid)
        rowToUpdate?.setRow(prev => { return { ...prev, ...data } })
        rowToUpdate?.setIsOn(prev => !prev)
        setSelectedRows(prevRows => prevRows.filter(selectedRow => rowToUpdate !== selectedRow))
        setModalData(prev => { return { ...prev, isOpen: false } })
        fetch("/api/row", {
            method: "PUT",
            headers: HEADERS,
            body: JSON.stringify({ uuid, data: { ...data } })
        }).then(res => res.json()).then(data => {
            if (data.success) {
                setRows(prevRows => (prevRows as Row[]).map(
                    (someRow: Row) => {
                        if (someRow.uuid === uuid) {
                            return { ...someRow, ...data }
                        } else return someRow
                    }
                ))
                NotificationManager.success("Saved With Success!")
            } else {
                NotificationManager.error(data.error, "Internal Server Error")
            }
        })
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
            {ModalData.isOpen &&
                <Modal
                    ModalData={ModalData}
                    setModalData={setModalData}
                />}
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
                    <button className={clsx(LogInStyles.button, styles.buttonNewRow)}
                        onClick={() => {
                            setModalData(prevData => {
                                return {
                                    ...prevData,
                                    isOpen: true,
                                    update: undefined,
                                    onConfirm: addNewRow
                                }
                            })
                        }}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        New Row
                    </button>
                </div>
                <div className={styles.navMiddle}>
                    <div className={styles.inputWrapper}>
                        <input type="text" placeholder="Search" autoFocus onChange={(e) => setinputVal(e.target.value)} />
                    </div>
                </div>
                <div className={styles.navRight}>
                    <button className={clsx(LogInStyles.button, styles.buttonDelete)} disabled={!(selectedRows.length > 0)}
                        onClick={() => {
                            if (selectedRows.length > 0) {
                                fetch("/api/row", {
                                    method: "DELETE",
                                    headers: HEADERS,
                                    body: JSON.stringify({
                                        uuid: selectedRows.map((row: SelectedRow) => row.uuid)
                                    })
                                }).then(res => res.json()).then(data => {
                                    if (data.success) {
                                        setSelectedRows(_ => [])
                                        NotificationManager.success(`Deleted ${selectedRows.length} Rows!`)
                                        updateRows()
                                    }
                                })
                            }
                        }}>
                        <FontAwesomeIcon icon={faTimes} />
                        Delete
                    </button>
                    <button className={clsx(LogInStyles.button, styles.buttonEdit)} disabled={!(selectedRows.length === 1)}
                        onClick={() => {
                            if (selectedRows.length > 0) { /* Handle even if someone tries to click with jquery for example */
                                const uuid = selectedRows[0].uuid
                                const row = (rows as Row[]).find((val) => val.uuid === uuid)
                                if (row) {
                                    const hasLogIn = Boolean(row.logInWithPlatform)
                                    const baseData: IModalDataBaseUpdate = { email: row.email, site: row.site, uuid: row.uuid }
                                    let updateData: IModalDataUpdateWithoutLogIn | IModalDataUpdateWithLogIn;
                                    if (hasLogIn) {
                                        updateData = {
                                            ...baseData,
                                            logInWithPlatform: (row as { logInWithPlatform: LogInPlatform }).logInWithPlatform
                                        }
                                    } else {
                                        updateData = {
                                            ...baseData,
                                            password: (row as { password: string }).password,
                                            username: (row as { username: string }).username
                                        }
                                    }
                                    setModalData(prevVal => {
                                        return {
                                            ...prevVal,
                                            update: updateData,
                                            isOpen: true,
                                            onConfirm: submitUpdate
                                        }
                                    })
                                }
                            }
                        }}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                        Edit
                    </button>
                    <button className={clsx(LogInStyles.button, styles.buttonNewRow)}>
                        <FontAwesomeIcon icon={faUser} />
                        {user?.username}
                    </button>
                </div>
            </nav>
            <div className={clsx(styles.wrapper, styles.flex)}>
                <RowsOld rows={rows && (rows as Row[]).filter((v: Row) =>
                    v.site.toLowerCase().includes(inputVal) ||
                    v.email.toLowerCase().includes(inputVal) /* ||
                    v.username?.toLowerCase()?.includes(inputVal) */
                ).sort((a: Row, b: Row) =>
                    a.site.localeCompare(b.site) || a.email.localeCompare(b.email)
                )} selectedRows={setSelectedRows} />
            </div>
            <NotificationContainer />
        </div>
    )
}

export default App