import type { NextApiResponse } from 'next'
import { User } from "@prisma/client"
import { CustomApiRequest, IApiBodyToken, IApiResToken } from '../../@types/types'
import prisma from "../../prisma/db"

export default async (req: CustomApiRequest<IApiBodyToken>, res: NextApiResponse<IApiResToken>) => {
    if (req.method === "POST") {
        if (!req.body.token) {
            return res.status(400).json({ success: false, error: "Token not valid" })
        }
        const user: User | null = await prisma.user.findFirst({
            where: {
                loginToken: req.body.token
            }
        })
        if (user) {
            res.status(200).json({ success: true, user })
        } else {
            res.status(400).json({ success: false, error: "Token not valid" })
        }
    } else {
        res.status(404).json({ success: false, error: `${req.method.toUpperCase()}` })
    }
}