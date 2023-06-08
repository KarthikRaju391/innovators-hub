import prisma from "../../../../../lib/prisma";
import { userRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	const { uid } = req.query;

	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}

	const existingInvestor = await prisma.investor.findUnique({
		where: {
			userId: uid,
		},
	});

	try {
		if (req.method === "POST") {
			const { email, type, panNumber, organizationName, website } = req.body;

			if (existingInvestor) {
				// put request
				const updatedInvestor = await prisma.investor.update({
					where: {
						userId: uid,
					},
					data: {
						email,
						type: type[0].id,
						panNumber,
						organizationName,
						website,
					},
				});

				return res.json(updatedInvestor);
			} else {
				const investor = await prisma.investor.create({
					data: {
						email,
						type: type[0].id,
						panNumber,
						organizationName,
						website,
						user: {
							connect: {
								id: uid,
							},
						},
					},
				});

				await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						role: {
							push: userRole.INVESTOR,
						},
					},
				});

				return res.json(investor);
			}
		} else if (req.method === "DELETE") {
			const { startup } = req.query;

			if (existingInvestor) {
				const deletedInvestor = await prisma.investor.delete({
					where: {
						userId: uid,
					},
				});

				await prisma.user.update({
					where: {
						id: uid,
					},
					data: {
						role: {
							set:
								startup === "true"
									? [userRole.USER, userRole.ENTREPRENEUR]
									: [userRole.USER],
						},
					},
				});

				return res.json(deletedInvestor);
			} else {
				return res.status(200).json({ message: "Investor not found" });
			}
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
