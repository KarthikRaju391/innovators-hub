import prisma from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions);

    const user = session?.user;
    const { title, body, permalink } = req.body;
    const result = await prisma.post.create({
        data: {
            title,
            body,
            permalink,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    });
    res.json(result);
}