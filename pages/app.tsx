import Link from "next/link"
import styles from "../styles/app.module.scss"
import LogInStyles from "../styles/components.LogInForm.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
const rows = []

const App = () => {
    return (
        <div className={[styles.Wrapper].join(" ")}>
            <nav className={[styles.flex].join(" ")}>
                <Link href="/">
                    <button className={[LogInStyles.button, styles.buttonBack].join(" ")}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Back
                    </button>
                </Link>
                <button className={[LogInStyles.button, styles.buttonNewRow].join(" ")}>
                    <FontAwesomeIcon icon={faPlus} />
                    New Row
                </button>
            </nav>
            <div className={[styles.wrapper, styles.flex].join(" ")}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        Site | Name | Password
                    </div>
                    <div className={styles.rows}>
                        {rows.map(row => {
                            <Row props={row}/>
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App