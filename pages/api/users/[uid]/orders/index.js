import prisma from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}

	const { uid, delivered, cursor } = req.query;
	const take = 3;

	const where = {
		userId: uid,
		...(delivered === "true"
			? {
					deliveryStatus: {
						equals: "DELIVERED",
					},
			  }
			: {
					deliveryStatus: {
						not: "DELIVERED",
					},
			  }),
		...(cursor ? { createdAt: { lt: new Date(parseInt(cursor)) } } : {}),
	};

	if (req.method === "GET") {
		const orders = await prisma.order.findMany({
			take,
			where,
			orderBy: { createdAt: "desc" },
			include: {
				products: {
					include: {
						startup: true,
					},
				},
			},
		});

		const nextCursor =
			orders.length > 0 ? orders[orders.length - 1].createdAt.getTime() : null;

		return res.json({ orders, cursor: nextCursor });
	}
}
