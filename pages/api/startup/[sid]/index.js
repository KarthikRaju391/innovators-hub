import prisma from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}
	try {
		if (req.method === "GET") {
			const startupData = await prisma.startup.findUnique({
				where: {
					id: req.query.sid,
				},
				include: {
					products: true,
					entrepreneur: {
						include: {
							user: true,
						},
					},
					project: true,
					posts: true
				},
			});
			return res.json(startupData);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Unable to process request" });
	}
}
