import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	const { oid } = req.query;
	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}

	try {
		if (req.method === "GET") {
			const order = await prisma.order.findUnique({
				where: {
					id: oid,
				},
				include: {
					products: {
						include: {
							startup: true,
						},
					},
				},
			});
			return res.json(order);
		} else if (req.method === "PUT") {
			const order = await prisma.order.update({
				where: {
					id: oid,
				},
				data: req.body,
			});
			return res.json(order);
		} else {
			await prisma.order.delete({
				where: {
					id: oid,
				},
			});

			return res.json({ message: "Order deleted" });
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
