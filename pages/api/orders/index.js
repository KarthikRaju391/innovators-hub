import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}
	try {
		if (req.method === "GET") {
			const users = await prisma.user.findMany({});
			res.json(users);
		} else if (req.method === "POST") {
			const user = await prisma.user.create({
				data: req.body,
			});
			return res.json(user);
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
