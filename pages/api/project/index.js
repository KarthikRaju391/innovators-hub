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

		if (req.method === "GET") {
			const project = await prisma.project.findMany({
				where: {
					startupId: startup.entrepreneur.startup.id,
				},
				include: {
					startup: true,
				},
			});
			return res.json(project);
		} else if (req.method === "POST") {
			const { projectName, projectDescription, projectImages, projectReport } =
				req.body;

			const project = await prisma.project.create({
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

			return res.json({project});
		} else if (req.method === "PUT") {
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
		}
	} catch (error) {
		console.log(error);
	}
}
