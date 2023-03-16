import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    try {
        if (req.method === "GET") {
            const posts = await prisma.post.findMany();
            return res.json(posts);
        } else if (req.method === "POST") {
            const { title, body, permalink } = req.body;
            const post = await prisma.post.create({
                data: {
                    title,
                    body,
                    permalink,
                    user: {
                        connect: {
                            id: session.user.id
                        }
                    }
                }
            });
            return res.json(post)
        }
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}