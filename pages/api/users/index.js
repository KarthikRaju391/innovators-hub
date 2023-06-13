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
		const users = await prisma.user.findMany({
			select: {
				email: true,
			},
		});
		res.json(users);
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
