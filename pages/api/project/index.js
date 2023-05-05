import { getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}
	try {
		if (req.method === "GET") {
			const startup = await prisma.user.findUnique({
				where: {
					id: session.user.id,
				},
				include: {
					entrepreneur: {
						include: {
							startup: {
								select: {
									id: true,
								},
							},
						},
					},
				},
			});
			const projectReport = await prisma.projectReport.findUnique({
				where: {
					startupId: startup.entrepreneur.startup.id,
				},
			});
			return res.json(projectReport);
		} else if (req.method === "POST") {
			const startup = await prisma.user.findUnique({
				where: {
					id: session.user.id,
				},
				include: {
					entrepreneur: {
						include: {
							startup: {
								select: {
									id: true,
								},
							},
						},
					},
				},
			});

			const projectExists = await prisma.projectReport.findUnique({
				where: {
					startupId: startup.entrepreneur.startup.id,
				},
			});
			if (projectExists) {
				await prisma.projectReport.update({
					where: {
						startupId: startup.entrepreneur.startup.id,
					},
					data: {
						report: req.body,
					},
				});

				return res.json("Report updated");
			}

			await prisma.projectReport.create({
				data: {
					startup: {
						connect: {
							id: startup.entrepreneur.startup.id,
						},
					},
					report: req.body,
				},
			});

			return res.json({ message: "Report created" });
		}
	} catch (error) {
		console.log(error);
	}
}
