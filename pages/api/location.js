import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";


export default async function handle(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if(!session) {
        res.status(401).json({ error: "Not authenticated" });
        return;
    }

    try {
        if(req.method === "POST") {
            const {latitude, longitude} = req.body;

            const location = await prisma.location.create({
                data: {
                    latitude: latitude,
                    longitude: longitude,
                },
            });
            return res.json(location);
        }
    } catch (err) {
        console.log(err);
    }
}