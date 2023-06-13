import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	const { cid } = req.query;

	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}
	try {
		if (req.method === "GET") {
			const cart = await prisma.cart.findUnique({
				where: {
					id: cid,
				},
				include: {
					products: true,
				},
			});
			return res.json(cart);
		} else if (req.method === "PUT") {
			const { cartData } = req.body;

			const existingCart = await prisma.cart.findUnique({
				where: { id: cid },
				include: {
					quantities: true,
				},
			});

			const currentProductIds = cartData.quantities.map((q) => q.productId);
			const removedProductIds = existingCart.quantities
				.filter((q) => !currentProductIds.includes(q.productId))
				.map((q) => q.productId);

			const updatedCart = await prisma.cart.update({
				where: { id: cid },
				data: {
					totalCost: cartData.totalCost,
					quantities: {
						updateMany: cartData.quantities.map((q) => {
							return {
								where: { id: q.id },
								data: {
									quantity: q.quantity,
								},
							};
						}),
					},
					products: {
						disconnect: removedProductIds.map((id) => ({ id })),
					},
				},
				include: {
					quantities: {
						include: {
							product: true,
						},
					},
				},
			});
			// await prisma.cartQuantity.deleteMany({
			// 	where: {
			// 		productId: {
			// 			in: removedProductIds,
			// 		},
			// 	},
			// 	product: {
			// 		disconnect: removedProductIds.map((id) => ({ id })),
			// 	}
			// });

			res.status(200).json(updatedCart);

			// update the whole cart with the cart items
			// const updatedCart = await prisma.cart.update({
			// 	where: { id: cid },
			// 	data: {
			// 		quantities: {
			// 			update: {
			// 				where: { id: cartItemId },
			// 				data: { quantity },
			// 			},
			// 		},
			// 	},
			// });

			// const cart = await prisma.cart.findUnique({
			// 	where: { id: cid },
			// 	include: { products: true },
			// });

			// if (cart && cart.products.length === 0) {
			// 	await prisma.cart.delete({
			// 		where: { id: cart.id },
			// 	});
			// }

			// // Update the quantity field
			// const updatedCartQuant = await prisma.cartQuantity.update({
			// 	where: { productId: cartItemId },
			// 	data: { quantity },
			// });

			// // Recalculate the total cost of the cart
			// const cartQuantities = await prisma.cartQuantity.findMany({
			// 	where: { cartId: cid },
			// 	select: {
			// 		quantity: true,
			// 		product: { select: { price: true } },
			// 	},
			// });
			// const totalCost = cartQuantities.reduce(
			// 	(acc, cq) => acc + cq.quantity * cq.product.price,
			// 	0
			// );
			// await prisma.cart.update({
			// 	where: { id: cid },
			// 	data: { totalCost },
			// });

			// return res.json(updatedCartQuant);
		} 
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
