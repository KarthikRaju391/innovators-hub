import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]"

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    try {
        if (req.method === "GET") {
            const products = await prisma.product.findMany();
            return res.json(products);
        } else if (req.method === "POST") {
            const { name, description, price, image } = req.body;
            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    price,
                    image,
                },
            });
            return res.json(product);
        } else {
            return res.status(405).end();
        }
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}