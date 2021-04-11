import Head from "next/head"
import useUser from "../components/hooks/useUser"
import styles from "../styles/index.module.scss"
import LoadingSvg from "../components/loading"
import LogInForm from "../components/LogInForm"
import { useRouter } from "next/router"

export default function Home() {
    const [user, loading, setUser] = useUser()
    const router = useRouter()

    if (user) {
        router.push("/app")
    }
    return (
        <div className={styles.wrapper}>
            <Head>
                <title>Home</title>
            </Head>


            <div className={styles.content}>
                {loading ? <LoadingSvg /> : <LogInForm />}
            </div>
        </div>
    )
}