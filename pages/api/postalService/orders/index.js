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
		const orders = await prisma.order.findMany({
			where: {
				deliveryStatus: {
					not: "PENDING",
				},
			},
			include: {
				products: {
					include: {
						startup: true,
					},
				},
				user: true,
			},
		});

		return res.status(200).json(orders);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
