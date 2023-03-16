import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]"

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)

    const { uid } = req.query;

    if (!session) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    try {
        if (req.method === "GET") {
            const user = await prisma.user.findUnique({
                where: {
                    id: uid,
                },
            });
            return res.json(user);
        } else if (req.method === "PUT") {
            console.log(req.body);
            const user = await prisma.user.update({
                where: {
                    id: uid,
                },
                data: req.body,
            });
            return res.json(user);
        } else {
            return res.status(405).end();
        }
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}