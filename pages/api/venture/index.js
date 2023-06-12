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
			// const users = await prisma.user.findMany({});
			const ventures = await prisma.venture.findMany({
				where: {
					investorId: session.user.investorId,
				},
				include: {
					project: {
						include: {
							startup: {
								include: {
									entrepreneur: {
										include: {
											user: true,
										},
									},
								},
							},
						},
					},
				},
			});
			return res.json(ventures);
		} else if (req.method === "POST") {
			const { contributedAmount, projectId } = req.body;

			var instance = new Razorpay({
				key_id: process.env.KEY_ID,
				key_secret: process.env.KEY_SECRET,
			});

			// get the startup details of the project
			const project = await prisma.project.findUnique({
				where: {
					id: projectId,
				},
				include: {
					startup: {
						include: {
							entrepreneur: {
								include: {
									user: true,
								},
							},
						},
					},
				},
			});

			const orderResponse = await instance.orders.create({
				amount: contributedAmount * 100,
				currency: "INR",
				transfers: [
					{
						account: project.startup.linkedAccountId,
						amount: contributedAmount * 100,
						currency: "INR",
						notes: {
							company: project.startup.name,
							name: project.startup.entrepreneur.user.name,
						},
						linked_account_notes: ["company"],
						on_hold: 0,
						// on_hold_until: 1671222870,
					},
				],
			});

			const createdVenture = await prisma.venture.create({
				data: {
					project: {
						connect: {
							id: projectId,
						},
					},
					investor: {
						connect: {
							id: session.user.investorId,
						},
					},
					amountInvested: parseFloat(contributedAmount),
					transaction: {
						create: {
							razorpayOrderId: orderResponse.id,
						},
					},
				},
				include: {
					transaction: true,
					investor: true,
				},
			});

			return res.json(createdVenture);
		} else if (req.method === "PUT") {
			const {
				ventureId,
				razorpay_order_id,
				razorpay_payment_id,
				razorpay_signature,
			} = req.body;
			await prisma.transaction.update({
				where: {
					ventureId: ventureId,
				},
				data: {
					razorpayPaymentId: razorpay_payment_id,
					razorpaySignature: razorpay_signature,
				},
				include: {
					venture: true,
				},
			});

			const resp = validatePaymentVerification(
				{ order_id: razorpay_order_id, payment_id: razorpay_payment_id },
				razorpay_signature,
				process.env.KEY_SECRET
			);
			return res.json(resp);
		} else if (req.method === "DELETE") {
			const { ventureId } = req.body;
			await prisma.venture.delete({
				where: {
					id: ventureId,
				},
			});
			return res.json({ message: "Venture deleted" });
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
