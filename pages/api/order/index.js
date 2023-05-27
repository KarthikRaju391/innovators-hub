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
			const users = await prisma.user.findMany({});
			res.json(users);
		} else if (req.method === "POST") {
			const orderItems = req.body;
			console.log(orderItems);

			// fetch the products for each productId in orderItems
			const products = await prisma.product.findMany({
				where: {
					id: {
						in: orderItems.map((item) => item.productId),
					},
				},
			});
			
			// calculate the total price of the order
			const totalPrice = orderItems.reduce((acc, item) => {
				const product = products.find((p) => p.id === item.productId);
				return acc + product.price * item.quantity;
			}, 0);

			return res.json({ products: products, totalPrice: totalPrice });

			// const instance = new Razorpay({
			// 	key_id: process.env.KEY_ID,
			// 	key_secret: process.env.KEY_SECRET,
			// });

			// instance.orders.create({
			// 	amount: product.price * quantity * 100,
			// 	currency: "INR",
			// 	receipt: "receipt#1",
			// 	notes: {
			// 		key1: "value3",
			// 		key2: "value2",
			// 	},
			// });
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
