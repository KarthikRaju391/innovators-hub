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
			const order = await prisma.order.findUnique({
				where: { id: req.query.oid },
				include: {
					products: {
						include: {
							startup: true,
						},
					},
				},
			});

			return res.status(200).json(order);
		} else if (req.method === "PUT") {
			const order = await prisma.order.update({
				where: { id: req.query.oid },
				data: {
					deliveryStatus: req.body.deliveryStatus.toUpperCase(),
				},
			});
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
