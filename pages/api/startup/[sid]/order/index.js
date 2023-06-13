import prisma from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}
	try {
		if (req.method === "GET") {
			const { sid } = req.query;
			const orders = await prisma.productOnOrder.findMany({
				where: {
					startupId: sid,
				},
				include: {
					order: {
						include: {
							user: true,
						},
					},
				},
			});
			return res.json(orders);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Unable to process request" });
	}
}
