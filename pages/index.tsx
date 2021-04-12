import Head from "next/head"
import useUser from "../components/hooks/useUser"
import styles from "../styles/index.module.scss"
import LoadingSvg from "../components/loading"
import LogInForm from "../components/LogInForm"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction } from "react"
import useWBOL from "../components/hooks/useWBOL"

export default function Home() {
    const [user, loading] = useUser()
    const router = useRouter()
    const [WBOL, setWBOL] = useWBOL()

    if (user && !WBOL) {
        router.push("/app")
    }
    return (
        <div className={styles.wrapper}>
            <Head>
                <title>Home</title>
            </Head>

            <div className={styles.content}>
                {loading ?
                    <LoadingSvg /> :
                    <LogInForm WBOLFunc={(value: boolean) => {
                        (setWBOL as Dispatch<SetStateAction<boolean>>)(value)
                    }} />}
            </div>
        </div>
    )
}