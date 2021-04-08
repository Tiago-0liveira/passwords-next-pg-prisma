import type { NextApiResponse } from 'next'
import { User } from "@prisma/client"
import hash from '../../helpers/hash'
import { CustomApiRequest, IApiBodyUser, IApiBodyUserPost, IApiBodyUserPut } from '../../@types/types'
import prisma from "../../prisma/db"

export default async (req: CustomApiRequest<IApiBodyUser | IApiBodyUserPost>, res: NextApiResponse) => {
    if (req.method === "GET") {
        try {
            res.status(200).json(await prisma.user.findMany({
                select: {
                    id: true,
                    updatedAt: true,
                    createdAt: true,
                    username: true, hashedPassword: true
                }
            }))
        } catch (error) {
            res.status(500).json({ error: "Internal server error!" })
        }
    } else if (req.method === "POST") {
        const PostBody = req.body as IApiBodyUserPost
        if (PostBody.type === "create") {
            try {
                const user: User = await prisma.user.create({
                    data: {
                        username: PostBody.username,
                        hashedPassword: hash(PostBody.password)
                    }
                })
                res.status(200).json({
                    user: {
                        username: user.username,
                        updatedAt: user.updatedAt,
                        createdAt: user.createdAt,
                        id: user.id
                    }
                })
            } catch (error) {
                res.status(500).json(error)
            }
        } else if (PostBody.type === "auth") {
            try {
                const user: User | null = await prisma.user.findFirst({
                    where: {
                        username: PostBody.username
                    }
                })
                if (user) {
                    res.status(200).json({ success: hash(PostBody.password) === hash(user.hashedPassword) })
                } else {
                    res.status(400).json({ error: `${PostBody.username} does not exist!` })
                }
            } catch (error) {
                res.status(500).json(error)
            }
        } else {
            res.status(400).json({ error: `${PostBody.type} is not a valid type!` })
        }
    } else if (req.method === "PUT") {
        const PutBody = req.body as IApiBodyUserPut
        console.log(`PutBody -> ${JSON.stringify(PutBody)}`)
        try {
            const isAuth = await prisma.user.findFirst({
                where: {
                    username: PutBody.username,
                    hashedPassword: hash(PutBody.password)
                }
            })
            if (isAuth) {
                console.log("here")
                let data: { hashedPassword?: string, username?: string } = {}
                if (PutBody.newPassword) data.hashedPassword = hash(PutBody.newPassword)
                if (PutBody.newUsername) data.username = PutBody.newUsername
                console.log(`data -> ${JSON.stringify(data)}`)
                if (!data.hashedPassword && !data.username) {
                    res.status(400).json({ error: "New Password or Username forgotton!" })
                }
                const user: User = await prisma.user.update({
                    where: {
                        username: PutBody.username
                    },
                    data
                })
                console.log(user)
                res.status(user ? 200 : 400).json(user ? { user } : { error: "Username or Password wrong!" })
            } else {
                res.status(400).json({ error: `${PutBody.username} does not exist!` })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    } else if (req.method === "DELETE") {
        const delBody = req.body as IApiBodyUser
        try {
            const isAuth = await prisma.user.findFirst({
                where: {
                    username: delBody.username,
                    hashedPassword: hash(delBody.password)
                }
            })
            if (isAuth) {
                await prisma.user.delete({
                    where: {
                        id: isAuth.id
                    }
                })
                res.status(200).json({ success: true })
            } else {
                res.status(400).json({ error: `${delBody.username} does not exist or password is wrong!` })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}