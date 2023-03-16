import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]"

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)

    const { pid } = req.query;

    if (!session) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    try {
        if (req.method === "GET") {
            const product = await prisma.product.findUnique({
                where: {
                    id: pid,
                },
            });
            return res.json(product);
        } else if (req.method === "PUT") {
            console.log(req.body);
            const product = await prisma.product.update({
                where: {
                    id: pid,
                },
                data: req.body,
            });
            return res.json(product);
        } else if (req.method === "DELETE") {
            const product = await prisma.product.delete({
                where: {
                    id: pid,
                },
            });
            return res.json(product);
        }
        else {
            return res.status(405).end();
        }
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}