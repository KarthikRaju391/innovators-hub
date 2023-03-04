// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";
// import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    const pan = req.body.pan;

    const user = await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            panNumber: pan
        }
    })
    res.status(200).json(user);
}
