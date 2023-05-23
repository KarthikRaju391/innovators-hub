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
			const project = await prisma.project.findUnique({
				where: {
					startupId: startup.entrepreneur.startup.id,
				},
			});
			return res.json(project);
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

			const projectExists = await prisma.project.findUnique({
				where: {
					startupId: startup.entrepreneur.startup.id,
				},
			});
			if (projectExists) {
				const {
					projectName,
					projectDescription,
					projectImages,
					projectReport,
				} = req.body;
				await prisma.project.update({
					where: {
						startupId: startup.entrepreneur.startup.id,
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
			}

			const { projectName, projectDescription, projectImages, projectReport } =
				req.body;

			await prisma.project.create({
				data: {
					startup: {
						connect: {
							id: startup.entrepreneur.startup.id,
						},
					},
					name: projectName,
					description: projectDescription,
					image: {
						set: projectImages,
					},
					projectReport: projectReport,
				},
			});

			return res.json({ message: "Project created" });
		}
	} catch (error) {
		console.log(error);
	}
}
