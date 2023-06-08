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

	try {
		if (req.method === "POST") {
			const {
				name,
				email,
				description,
				location,
				website,
				panNumber,
				gstNumber,
			} = req.body;

			const existingStartup = await prisma.user.findUnique({
				where: {
					id: uid,
				},
				include: {
					entrepreneur: true,
				},
			});

			if (existingStartup.startup) {
				// put request
				const updatedStartup = await prisma.startup.update({
					where: {
						id: existingStartup.entrepreneur.startup.id,
					},
					data: {
						name,
						email,
						description,
						location,
						website,
						panNumber,
						gstNumber,
					},
				});
				return res.json(updatedStartup);
			} else {
				const startup = await prisma.startup.create({
					data: {
						name,
						description,
						location,
						email,
						website,
						panNumber,
						gstNumber,
						entrepreneur: {
							create: {
								user: {
									connect: {
										id: uid,
									},
								},
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
							push: userRole.ENTREPRENEUR,
						},
					},
				});

				return res.json(startup);
			}
		} else if (req.method === "DELETE") {
			const existingStartup = await prisma.user.findUnique({
				where: {
					id: uid,
				},
				include: {
					entrepreneur: {
						include: {
							startup: true,
						},
					},
				},
			});
			const { investor } = req.query;

			const deletedStartup = await prisma.startup.delete({
				where: {
					id: existingStartup.entrepreneur.startup.id,
				},
			});

			await prisma.user.update({
				where: {
					id: uid,
				},
				data: {
					role: {
						set:
							investor === "true"
								? [userRole.USER, userRole.INVESTOR]
								: [userRole.USER],
					},
				},
			});
			return res.json(deletedStartup);
		}
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}
