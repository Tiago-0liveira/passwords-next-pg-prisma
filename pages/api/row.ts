import type { NextApiRequest, NextApiResponse } from 'next'
import { RowPostType } from '../../constants/consts'
import prisma from "../../prisma/db"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        try {
            res.status(200).json(await prisma.row.findMany())
        } catch (error) {
            res.status(500).json({ error: "Internal server error!" })
        }
    } else if (req.method === "POST") {
        if (req.body.type === RowPostType.get) {
            const rows = await prisma.user.findFirst({
                select: { Row: true },
                where: { id: req.body.userId }
            })
            if (rows) {
                res.status(200).json(rows.Row)
            } else {
                res.status(400).json({ success: false, error: rows })
            }
        } else if (req.body.type === RowPostType.create) {
            const row = await prisma.row.create({
                data: {
                    ...req.body.data
                }
            })
            if (row) {
                res.status(200).json({ success: true, row })
            } else {
                res.status(400).json({ success: false, error: row })
            }
        }
    } else if (req.method === "PUT") {
        const row = await prisma.row.update({
            where: {
                uuid: req.body.uuid
            },
            data: {
                ...req.body.data
            }
        })
        if (row) {
            res.status(200).json({ success: true, row })
        } else {
            res.status(400).json({ success: false, error: row })
        }
    } else if (req.method === "DELETE") {
        if (req.body.type === RowPostType.all) {
            const rows = await prisma.row.deleteMany()
            if (rows) {
                res.status(200).json({ rows })
            } else {
                res.status(500).json({ error: rows })
            }
        } else {

            const row = await prisma.row.delete({
                where: {
                    uuid: req.body.uuid
                }
            })
            if (row) {
                res.status(200).json({ success: true, row })
            } else {
                res.status(400).json({ success: false, error: row })
            }
        }
    }
}