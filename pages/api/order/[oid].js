import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]"

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions);

    const { oid } = req.query;
    if(!session) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }

    try {
        if (req.method === "GET") {
            const order = await prisma.order.findUnique({
                where: {
                    id: oid,
                },
            });
            return res.json(order);
        } else if (req.method === "PUT") {
            console.log(req.body);
            const order = await prisma.order.update({
                where: {
                    id: oid,
                },
                data: req.body,
            });
            return res.json(order);
        } else {
            return res.status(405).end();
        }
    }
    catch (error) {
        console.log(error)
        throw new Error(error);
    }
}