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
			const result = await prisma.postalService.findMany({});
			res.json(result);
		} else if (req.method === "POST") {
			const { email, accessType } = req.body;
			const user = await prisma.postalService.create({
				data: {
					email,
					accessType: accessType.toUpperCase(),
				},
			});
			return res.json(user);
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
