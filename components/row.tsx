import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { LogInPlatform, Row } from "@prisma/client"
import clsx from "clsx"
import { useState } from "react"
import styles from "../styles/components.row.module.scss"
import { Dispatch, SetStateAction } from "react"
import { LogInPlatforms } from "../constants/consts"
import { IconDefinition } from "@fortawesome/free-brands-svg-icons"

type RowComponentProps = {
    row: Row,
    selectedRows: Dispatch<SetStateAction<string[]>>
}
const RowComponent = ({ row, selectedRows }: RowComponentProps) => {
    const [isOn, setIsOn] = useState(false)

    return (
        <div className={styles.row} data-uuid={row.uuid} onClick={(e) => {
            selectedRows(prevVal => {
                console.log(prevVal.length + (!isOn ? 1 : 0), !isOn ? [...prevVal, row.uuid] : prevVal)
                if (!isOn) return [...prevVal, row.uuid]
                else {
                    console.log(`row.tsx|25|`)
                    console.log(prevVal.filter(uuid => {
                        return uuid !== row.uuid
                    }))
                    return prevVal.filter(uuid => {
                        return uuid !== row.uuid
                    })
                }
            })
            setIsOn(prev => !prev)
        }}>
            <div className={clsx(styles.SelectedDiv, isOn && styles.On)} onClick={() => { }} />
            <div>
                <span>
                    {row.site}
                </span>
            </div>
            <div>
                <span>
                    {row.email}
                </span>
            </div>
            <div className={clsx(row.password || styles.password)}>

                {row.password ?
                    <span>{row.password}</span>
                    : <span>Logged In With
                        {(() => {
                            const icon = LogInPlatforms.find(({ value }) =>
                                value === row.logInWithPlatform
                            )?.icon
                            return icon ? < FontAwesomeIcon icon={icon} /> : row.logInWithPlatform
                        })()}
                    </span>}

            </div>
        </div>
    )
}

export default RowComponent