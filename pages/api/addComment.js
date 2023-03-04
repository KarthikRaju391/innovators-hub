import prisma from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions);
    const { permalink, body, parentId } = req.body;

    const user = session?.user;

    try {
        const comment = await prisma.comment.create({
            data: {
                body,
                post: {
                    connect: {
                        permalink
                    },
                },
                user: {
                    connect: {
                        id: user?.id
                    }
                },
                ...(parentId && {
                    parent: {
                        connect: {
                            id: parentId
                        }
                    }
                })
            }
        })

        return res.json(comment);

    } catch (error) {
        console.log(error)
        throw new Error(error);
    }

}