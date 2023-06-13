import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}
	// check if the user exists

	try {
		if (req.method === "GET") {
			const result = await prisma.postalService.findMany({});
			res.json(result);
		} else if (req.method === "POST") {
			const { email, accessType } = req.body;
			const existingUser = await prisma.user.findUnique({
				where: {
					email,
				},
			});
			const user = await prisma.postalService.create({
				data: {
					email,
					accessType: accessType.toUpperCase(),
				},
			});

			if (existingUser) {
				await prisma.user.update({
					where: {
						email,
					},
					data: {
						role: {
							set: ["ADMIN"],
						},
					},
				});
			}
			// update the user role to just "ADMIN"

			return res.json(user);
		} else if (req.method === "PUT") {
			const { email } = req.body;
			const user = await prisma.postalService.delete({
				where: {
					email,
				},
			});
			const existingUser = await prisma.user.findUnique({
				where: {
					email,
				},
			});
			// update the user role to just "USER"
			if (existingUser) {
				await prisma.user.update({
					where: {
						email,
					},
					data: {
						role: {
							set: ["USER"],
						},
					},
				});
			}

			return res.json(user);
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
