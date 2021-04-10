import Head from "next/head"
import { v4 } from "uuid"
import useUser from "../components/hooks/useUser"


export default function Home() {
    const [user, loading] = useUser()

    return (
        <div>
            <Head>
                <title>Home</title>
            </Head>
        </div>
    )
}