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
		const { deliveryStatus } = req.query;
		const orders = await prisma.order.findMany({
			where: {
				...(deliveryStatus
					? {
							deliveryStatus: {
								equals: deliveryStatus.toUpperCase(),
							},
					  }
					: {}),
			},
		});

		const products = await prisma.productOnOrder.findMany({
			where: {
				orderId: {
					in: orders.map((order) => order.id),
				},
			},
			include: {
				startup: true,
				order: {
					include: {
						user: {
							select: {
								phoneNumber: true,
							},
						},
					},
				},
			},
		});

		return res.status(200).json(products);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
