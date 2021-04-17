import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Row } from "@prisma/client"
import clsx from "clsx"
import { useState } from "react"
import styles from "../styles/components.row.module.scss"
import { Dispatch, SetStateAction } from "react"
import { LogInPlatforms } from "../constants/consts"
import { SelectedRow } from "../@types/types"

/* @ts-ignore */
const copyToClipboard = (e) => {
    e.target.textContent && navigator.clipboard.writeText(e.target.textContent)
}
type RowComponentProps = {
    row: Row,
    selectedRows: Dispatch<SetStateAction<SelectedRow[]>>
}
const RowComponent = ({ row, selectedRows }: RowComponentProps) => {
    const [isOn, setIsOn] = useState(false)
    const [theRow, setRow] = useState<Row>(row)
    return (
        <div className={clsx(styles.row, isOn && styles.rowSelected)} onClick={() => {
            selectedRows(prevVal => {
                if (!isOn) return [...prevVal, { uuid: theRow.uuid, setIsOn, setRow }]
                else {
                    return prevVal.filter(prevRow => {
                        return prevRow.uuid !== theRow.uuid
                    })
                }
            })
            setIsOn(prev => !prev)
        }}>
            <div className={clsx(styles.SelectedDiv, isOn && styles.On)} />
            <div>
                <span onClick={copyToClipboard}>
                    {theRow.site}
                </span>
            </div>
            <div>
                <span onClick={copyToClipboard}>
                    {theRow.email}
                </span>
            </div>
            <div className={clsx(theRow.password || styles.password)}>

                {theRow.password ?
                    <span onClick={copyToClipboard}>{theRow.password}</span>
                    : <span>Logged In With
                        {(() => {
                            const icon = LogInPlatforms.find(({ value }) =>
                                value === theRow.logInWithPlatform
                            )?.icon
                            return icon ? < FontAwesomeIcon icon={icon} /> : theRow.logInWithPlatform
                        })()}
                    </span>}

            </div>
        </div>
    )
}

export default RowComponent