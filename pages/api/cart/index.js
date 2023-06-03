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
			const cart = await prisma.cart.findUnique({
				where: {
					userId: session.user.id,
				},
				include: {
					quantities: {
						include: {
							product: true,
						},
					},
				},
			});
			return res.json(cart);
		} else if (req.method === "POST") {
			const { productId, quantity } = req.body;
			const cart = await prisma.cart.findUnique({
				where: {
					userId: session.user.id,
				},
				include: {
					products: true,
					quantities: {
						include: {
							product: {
								select: {
									price: true,
								},
							},
						},
					},
				},
			});

			if (!cart) {
				const product = await prisma.product.findUnique({
					where: { id: productId },
				});

				const newCart = await prisma.cart.create({
					data: {
						user: {
							connect: {
								id: session.user.id,
							},
						},
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
						totalCost: product.price * quantity,
					},
					include: {
						quantities: true,
						products: true,
					},
				});
				return res.json(newCart);
			}
			const existingQuantity = cart.quantities.find(
				(q) => q.productId === productId
			);

			if (existingQuantity) {
				// update the quantity of an existing product in the cart
				const updatedQuantity = await prisma.cartQuantity.update({
					where: { id: existingQuantity.id },
					data: { quantity: existingQuantity.quantity + quantity },
					include: {
						product: {
							select: {
								price: true,
							},
						},
					},
				});
				const updatedQuantities = cart.quantities.map((q) =>
					q.id === updatedQuantity.id ? updatedQuantity : q
				);
				const totalCost = updatedQuantities.reduce(
					(sum, q) => sum + q.product.price * q.quantity,
					0
				);
				return prisma.cart.update({
					where: { id: cart.id },
					data: {
						quantities: {
							updateMany: updatedQuantities.map((q) => ({
								where: { id: q.id },
								data: { quantity: q.quantity },
							})),
						},
						totalCost,
					},
					include: {
						quantities: {
							include: {
								product: {
									select: {
										price: true,
									},
								},
							},
						},
						products: true,
					},
				});
			}

			// add a new product to the cart
			const newQuantity = await prisma.cartQuantity.create({
				data: {
					product: {
						connect: {
							id: productId,
						},
					},
					quantity,
					cart: { connect: { id: cart.id } },
				},
				include: {
					product: {
						select: {
							price: true,
						},
					},
				},
			});
			const updatedQuantities = [...cart.quantities, newQuantity];
			const totalCost = updatedQuantities.reduce(
				(sum, q) => sum + q.product.price * q.quantity,
				0
			);

			return prisma.cart.update({
				where: { id: cart.id },
				data: {
					quantities: {
						updateMany: updatedQuantities.map((q) => ({
							where: { id: q.id },
							data: { quantity: q.quantity },
						})),
					},
					totalCost,
					products: {
						connect: {
							id: productId,
						},
					},
				},
				include: { quantities: { include: { product: true } }, products: true },
			});
		} else if (req.method === "DELETE") {
			await prisma.cart.delete({
				where: {
					userId: session.user.id,
				},
			});
			return res.json({ message: "Cart deleted successfully" });
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
