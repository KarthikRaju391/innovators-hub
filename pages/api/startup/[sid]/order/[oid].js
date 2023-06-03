import prisma from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import { Status } from "@prisma/client";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}

	try {
		if (req.method === "GET") {
			const { sid, oid } = req.query;
			const order = await prisma.order.findUnique({
				where: {
					id: oid,
				},
				include: {
					products: true,
					user: true,
				},
			});
			return res.json(order);
		} else if (req.method === "PUT") {
			const { oid } = req.query;
			const updatedOrder = await prisma.order.update({
				where: {
					id: oid,
				},
				data: {
					deliveryStatus: Status.READY,
				},
			});

			return res.json(updatedOrder);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Unable to process request" });
	}
}
