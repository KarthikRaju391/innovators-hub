import prisma from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const session = getServerSession(req, res, authOptions)
    const permalink = req.query.permalink;

    if (!session) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }
    try {
        const posts = await prisma.post.findMany({
            where: {
                permalink,
            }
        });
        res.json(posts);
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}