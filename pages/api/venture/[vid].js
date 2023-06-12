import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		res.status(401).json({ error: "Not authenticated" });
		return;
	}

	const { vid } = req.query;

	if (req.method === "GET") {
		const venture = await prisma.venture.findUnique({
			where: {
				id: vid,
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
								posts: true,
							},
						},
					},
				},
				transaction: true,
			},
		});

		return res.json(venture);
	}
}
