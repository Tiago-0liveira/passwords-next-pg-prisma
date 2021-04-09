import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { IApiResToken } from "../../@types/types";


export default function useUser() {
    const [User, setUser] = useState<{} | User>({});

    useEffect(() => {

        (async () => {
            try {
                if (document.cookie) {
                    const res = await fetch("/api/token", {
                        method: "POST", body: JSON.stringify({
                            token: JSON.stringify(document.cookie)
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
            }
        })()

    }, []);

    return User
}