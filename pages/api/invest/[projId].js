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
		const { projId } = req.query;
		if (req.method === "GET") {
			const project = await prisma.project.findUnique({
				where: {
					id: projId,
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
					venture: {
						include: {
							investor: {
								include: {
									user: true,
								},
							},
						},
					},
				},
			});
			return res.json(project);
		}
	} catch (error) {
		console.log(error);
	}
}
