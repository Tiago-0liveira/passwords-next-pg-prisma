import { Row } from "@prisma/client"
import styles from "../styles/rowsOld.module.scss"
import Loading from "./loading"
import RowComponent from "./row"
import clsx from "clsx"
interface RowsOldProps {
    rows: Row[] | false,
    inputVal: string
}
const RowsOld = ({ rows, inputVal }: RowsOldProps) => {

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
                    (rows as Row[]).sort((a: Row, b: Row) =>
                        a.site.toLowerCase() > b.site.toLowerCase() ? 1 : -1
                    ).filter((v: Row) =>
                        v.site.toLowerCase().includes(inputVal) ||
                        v.email.toLowerCase().includes(inputVal) ||
                        v.username?.toLowerCase()?.includes(inputVal)
                    ).map((row: Row, i) =>
                        <RowComponent {...row} key={i} />
                    )
                    : <Loading />}
            </div>
        </div>
    )
}
export default RowsOld