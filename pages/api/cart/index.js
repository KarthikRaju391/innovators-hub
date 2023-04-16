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
			const users = await prisma.cart.findUnique({
				where: {
					userId: session.user.id,
				},
				include: {
					products: true,
					quantities: true,
				},
			});
			res.json(users);
		} else if (req.method === "POST") {
			const { productId, quantity } = req.body;
			const cart = await prisma.cart.findUnique({
				where: {
					userId: session.user.id,
				},
				include: {
					products: true,
					quantities: true,
				},
			});

			if (!cart) {
				const newCart = await prisma.cart.create({
					data: {
						userId: session.user.id,
						products: {
							connect: {
								id: productId,
							},
						},
						quantities: {
							create: {
								quantity: quantity,
								productId,
							},
						},
					},
					include: {
						quantities: true,
						products: true,
					},
				});
				return res.json(newCart);
			}
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
