import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Razorpay from "razorpay";
var {
	validatePaymentVerification,
} = require("../../../node_modules/razorpay/dist/utils/razorpay-utils.js");

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

			var instance = new Razorpay({
				key_id: process.env.KEY_ID,
				key_secret: process.env.KEY_SECRET,
			});

			const orderResponse = await instance.orders.create({
				amount: totalPrice * 100,
				currency: "INR",
			});

			const createdOrder = await prisma.order.create({
				data: {
					userId: session.user.id,
					quantity: orderItems.reduce((acc, item) => {
						return acc + item.quantity;
					}, 0),
					deliverTo: session.user.address,
					products: {
						create: products.map((product) => ({
							productId: product.id,
							productName: product.name,
							productPrice: product.price,
						})),
					},
					orderCost: totalPrice,
					transaction: {
						create: {
							razorpayOrderId: orderResponse.id,
						},
					},
				},
				include: {
					transaction: true,
					products: true,
				},
			});

			return res.json(createdOrder);
		} else if (req.method === "PUT") {
			const {
				orderId,
				razorpay_order_id,
				razorpay_payment_id,
				razorpay_signature,
			} = req.body;
			await prisma.transaction.update({
				where: {
					orderId: orderId,
				},
				data: {
					razorpayPaymentId: razorpay_payment_id,
					razorpaySignature: razorpay_signature,
				},
				include: {
					order: true,
				},
			});

			const resp = validatePaymentVerification(
				{ order_id: razorpay_order_id, payment_id: razorpay_payment_id },
				razorpay_signature,
				process.env.KEY_SECRET
			);
			return res.json(resp);
		} else if (req.method === "DELETE") {
			const { orderId } = req.body;
			await prisma.order.delete({
				where: {
					id: orderId,
				},
			});
			return res.json({ message: "Order deleted" });
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
