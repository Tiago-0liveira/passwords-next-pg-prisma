import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { IApiResToken, TuseUser } from "../../@types/types";
import { HEADERS } from "../../constants/consts";


const useUser: TuseUser = () => {
    const [user, setUser] = useState<undefined | User>();
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {

        (async () => {
            try {
                if (JSON.parse(document.cookie).token.length > 20) {
                    const res = await fetch("/api/token", {
                        method: "POST", headers: HEADERS, body: JSON.stringify({
                            token: JSON.parse(document.cookie).token
                        })
                    })
                    const body: IApiResToken = await res.json()
                    if (body.success) {
                        setUser(body.user as User)
                    } else {
                        console.log(`Token auth -> ${body.error}`)
                    }
                }
            } catch (error) {
                console.log(`Token auth -> ${JSON.stringify(error)}`)
            } finally {
                setLoading(false)
            }
        })()

    }, []);

    return [user, loading, setUser]
}

export default useUser