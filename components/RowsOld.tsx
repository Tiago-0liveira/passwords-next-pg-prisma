import { Row } from "@prisma/client"
import styles from "../styles/rowsOld.module.scss"
import Loading from "./loading"
import RowComponent from "./row"
import clsx from "clsx"
import { Dispatch, SetStateAction } from "react"
interface RowsOldProps {
    rows: Row[] | false,
    selectedRows: Dispatch<SetStateAction<string[]>>
}
const RowsOld = ({ rows, selectedRows }: RowsOldProps) => {

    return (
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
            <div className={clsx(styles.rows, !rows && styles.loading)}>
                {rows ?
                    rows.map((row: Row, i) =>
                        <RowComponent row={row} key={i} selectedRows={selectedRows} />
                    )
                    : <Loading />}
            </div>
        </div>
    )
}
export default RowsOld