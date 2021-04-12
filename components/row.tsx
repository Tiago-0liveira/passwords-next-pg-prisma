import { Row } from "@prisma/client"
import styles from "../styles/components.row.module.scss"

const RowComponent = (props: Row) => {
    return (
        <div className={styles.row}>
            <div>
                <span>
                    {props.site}
                </span>
            </div>
            <div>
                <span>
                    {props.email}
                </span>
            </div>
            <div>
                <span>
                    {props.password}
                </span>
            </div>
        </div>
    )
}

export default RowComponent