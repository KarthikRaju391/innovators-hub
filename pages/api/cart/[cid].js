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
			const { cartItemId, quantity } = req.body;

			const cart = await prisma.cart.findUnique({
				where: { id: cid },
				include: { products: true },
			});

			if (cart && cart.products.length === 0) {
				await prisma.cart.delete({
					where: { id: cart.id },
				});
			}

			// Update the quantity field
			const updatedCartQuant = await prisma.cartQuantity.update({
				where: { productId: cartItemId },
				data: { quantity },
			});

			// Recalculate the total cost of the cart
			const cartQuantities = await prisma.cartQuantity.findMany({
				where: { cartId: cid },
				select: {
					quantity: true,
					product: { select: { price: true } },
				},
			});
			const totalCost = cartQuantities.reduce(
				(acc, cq) => acc + cq.quantity * cq.product.price,
				0
			);
			await prisma.cart.update({
				where: { id: cid },
				data: { totalCost },
			});

			return res.json(updatedCartQuant);
		} else if (req.method === "DELETE") {
			const { cartItemId } = req.body;

			const cart = await prisma.cart.findUnique({
				where: { id: cid },
				include: { products: true },
			});

			if (cart && cart.products.length === 0) {
				await prisma.cart.delete({
					where: { id: cart.id },
				});
			}

			const cartQuantity = await prisma.cartQuantity.findUnique({
				where: { productId: cartItemId },
				include: { cart: true, product: true },
			});

			await prisma.cartQuantity.delete({
				where: { productId: cartItemId },
			});

			// Remove the product from the cart's products array
			await prisma.cart.update({
				where: { id: cartQuantity.cartId },
				data: {
					products: {
						disconnect: { id: cartItemId },
					},
				},
			});
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
