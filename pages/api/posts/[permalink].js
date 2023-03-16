import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions)

    const {permalink} = req.query;

    if (!session) {
        res.status(401).json({error: "Not authenticated"});
        return;
    }
    try {
        if(req.method === "GET") {
            const post = await prisma.post.findUnique({
                where: {
                    permalink: permalink,
                },
            });
            const comments = await prisma.comment.findMany({
                where: {
                    post: {
                        permalink: permalink,
                    },
                },
            });

            return res.json({post, comments});
        } else if (req.method === "PUT") {
            console.log(req.body);
            const post = await prisma.post.update({
                where: {
                    permalink: permalink,
                },
                data: req.body,
            });

            return res.json(post);
        } else if (req.method === "DELETE") {
            console.log(req.body);
            const post = await prisma.post.delete({
                where: {
                    permalink: permalink,
                },
            });
            await prisma.comment.deleteMany({
                where: {
                    post: {
                        permalink: permalink,
                    },
                },
            });
            return res.json(post);
        }
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}