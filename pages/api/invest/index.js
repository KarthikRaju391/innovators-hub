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
			const projects = await prisma.project.findMany({
				include: {
					startup: true,
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
			return res.json(projects);
		}
	} catch (error) {
		console.log(error);
	}
}
