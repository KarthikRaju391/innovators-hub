import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}

	const { pid } = req.query;

	try {
		if (req.method === "GET") {
			const project = await prisma.project.findUnique({
				where: {
					id: pid,
				},
				include: {
					startup: {
						include: {
							posts: true,
						},
					},
				},
			});
			return res.json(project);
		} else if (req.method === "PUT") {
			const { projectName, projectDescription, projectImages, projectReport } =
				req.body;
			await prisma.project.update({
				where: {
					id: pid,
				},
				data: {
					name: projectName,
					description: projectDescription,
					image: {
						set: projectImages,
					},
					projectReport: projectReport,
				},
			});
			return res.json("Report updated");
		} else if (req.method === "DELETE") {
			await prisma.project.delete({
				where: {
					id: pid,
				},
			});
			return res.json("Project deleted");
		}
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: "Unable to update project" });
	}
}
